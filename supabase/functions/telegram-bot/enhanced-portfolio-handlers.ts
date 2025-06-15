
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSession, setSession, deleteSession } from './session-manager.ts'
import { UserSession } from './types.ts'
import { sendTelegramMessage, sendTelegramPhoto } from './telegram-api.ts'

export const createEnhancedPortfolioHandlers = (supabase: SupabaseClient) => {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

  const validatePhoto = (file: any) => {
    if (!file?.file_size) return { valid: false, error: 'Файл не найден' };
    if (file.file_size > MAX_FILE_SIZE) return { valid: false, error: 'Файл слишком большой (максимум 20MB)' };
    if (!file.mime_type || !ALLOWED_FORMATS.includes(file.mime_type)) {
      return { valid: false, error: 'Неподдерживаемый формат. Разрешены: JPEG, PNG, WebP' };
    }
    return { valid: true };
  };

  const getCategoryKeyboard = () => ({
    inline_keyboard: [
      [
        { text: '💒 Свадьба', callback_data: 'cat_wedding' },
        { text: '💕 Love Story', callback_data: 'cat_lovestory' }
      ],
      [
        { text: '👤 Портрет', callback_data: 'cat_portrait' },
        { text: '👨‍👩‍👧‍👦 Семья', callback_data: 'cat_family' }
      ],
      [
        { text: '🤰 Беременность', callback_data: 'cat_maternity' },
        { text: '🎉 Мероприятие', callback_data: 'cat_event' }
      ],
      [
        { text: '🔙 Назад в меню', callback_data: 'main_menu' },
        { text: '❌ Отмена', callback_data: 'cancel' }
      ]
    ]
  });

  const getConfirmationKeyboard = () => ({
    inline_keyboard: [
      [
        { text: '✅ Сохранить', callback_data: 'confirm_save' },
        { text: '✏️ Изменить описание', callback_data: 'edit_description' }
      ],
      [
        { text: '🔄 Изменить категорию', callback_data: 'change_category' },
        { text: '❌ Отменить', callback_data: 'cancel' }
      ]
    ]
  });

  const processPhotoUpload = async (userId: number, photoData: any, botToken: string) => {
    try {
      console.log('📸 Начало обработки фото от пользователя:', userId);
      
      if (!photoData?.file_id) {
        throw new Error('file_id не найден в данных фото');
      }

      // Валидация фото
      const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${photoData.file_id}`);
      const fileData = await fileResponse.json();
      
      if (!fileData.ok) {
        throw new Error('Не удалось получить информацию о файле');
      }

      const validation = validatePhoto(fileData.result);
      if (!validation.valid) {
        await sendTelegramMessage(botToken, userId, `❌ ${validation.error}`, null);
        return;
      }

      // Скачиваем фото
      const photoResponse = await fetch(`https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`);
      const photoBuffer = await photoResponse.arrayBuffer();
      
      const fileName = `portfolio_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      
      // Загружаем в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`portfolio/${fileName}`, photoBuffer, {
          contentType: 'image/jpeg',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(`portfolio/${fileName}`);

      // Сохраняем в сессии
      const session: UserSession = {
        step: 'waiting_title',
        data: {
          photo_url: urlData.publicUrl,
          file_id: photoData.file_id
        },
        created_at: Date.now()
      };
      
      setSession(userId, session);
      
      await sendTelegramMessage(
        botToken, 
        userId, 
        '📸 <b>Фото загружено!</b>\n\n📝 Теперь введите <b>название</b> для этой фотографии:', 
        null
      );

      console.log('✅ Фото успешно загружено:', urlData.publicUrl);
      
    } catch (error) {
      console.error('❌ Ошибка загрузки фото:', error);
      await sendTelegramMessage(
        botToken, 
        userId, 
        `❌ <b>Ошибка загрузки:</b>\n${error.message}\n\n🔄 Попробуйте еще раз или обратитесь к администратору.`, 
        {
          inline_keyboard: [
            [{ text: '🔙 Назад в меню', callback_data: 'main_menu' }]
          ]
        }
      );
      deleteSession(userId);
    }
  };

  const processTitleInput = async (userId: number, title: string, botToken: string) => {
    try {
      const session = getSession(userId);
      if (!session || session.step !== 'waiting_title') {
        await sendTelegramMessage(botToken, userId, '❌ Сессия истекла. Начните заново.', null);
        return;
      }

      if (title.length < 3) {
        await sendTelegramMessage(botToken, userId, '❌ Название должно содержать минимум 3 символа. Попробуйте еще раз:', null);
        return;
      }

      session.step = 'waiting_category';
      session.data.title = title;
      setSession(userId, session);

      await sendTelegramMessage(
        botToken,
        userId,
        `📝 <b>Название сохранено:</b> ${title}\n\n🎨 Теперь выберите категорию:`,
        getCategoryKeyboard()
      );

    } catch (error) {
      console.error('❌ Ошибка обработки названия:', error);
      await sendTelegramMessage(botToken, userId, '❌ Произошла ошибка. Попробуйте еще раз.', null);
    }
  };

  const processCategorySelection = async (userId: number, category: string, botToken: string) => {
    try {
      const session = getSession(userId);
      if (!session || session.step !== 'waiting_category') {
        await sendTelegramMessage(botToken, userId, '❌ Сессия истекла. Начните заново.', null);
        return;
      }

      const categoryMap: { [key: string]: string } = {
        'cat_wedding': 'wedding',
        'cat_lovestory': 'lovestory', 
        'cat_portrait': 'portrait',
        'cat_family': 'family',
        'cat_maternity': 'maternity',
        'cat_event': 'event'
      };

      const categoryNames: { [key: string]: string } = {
        'wedding': '💒 Свадьба',
        'lovestory': '💕 Love Story',
        'portrait': '👤 Портрет', 
        'family': '👨‍👩‍👧‍👦 Семья',
        'maternity': '🤰 Беременность',
        'event': '🎉 Мероприятие'
      };

      const selectedCategory = categoryMap[category];
      if (!selectedCategory) {
        await sendTelegramMessage(botToken, userId, '❌ Неизвестная категория. Выберите из предложенных:', getCategoryKeyboard());
        return;
      }

      session.step = 'waiting_description';
      session.data.category = selectedCategory;
      setSession(userId, session);

      await sendTelegramMessage(
        botToken,
        userId,
        `🎨 <b>Категория:</b> ${categoryNames[selectedCategory]}\n\n📄 Добавьте описание к фотографии (или отправьте "-" чтобы пропустить):`,
        null
      );

    } catch (error) {
      console.error('❌ Ошибка выбора категории:', error);
      await sendTelegramMessage(botToken, userId, '❌ Произошла ошибка. Попробуйте еще раз.', getCategoryKeyboard());
    }
  };

  const processDescriptionInput = async (userId: number, description: string, botToken: string) => {
    try {
      const session = getSession(userId);
      if (!session || session.step !== 'waiting_description') {
        await sendTelegramMessage(botToken, userId, '❌ Сессия истекла. Начните заново.', null);
        return;
      }

      session.data.description = description === '-' ? '' : description;
      session.step = 'confirming';
      setSession(userId, session);

      const categoryNames: { [key: string]: string } = {
        'wedding': '💒 Свадьба',
        'lovestory': '💕 Love Story', 
        'portrait': '👤 Портрет',
        'family': '👨‍👩‍👧‍👦 Семья',
        'maternity': '🤰 Беременность',
        'event': '🎉 Мероприятие'
      };

      const preview = `
📋 <b>Предпросмотр фотографии:</b>

📝 <b>Название:</b> ${session.data.title}
🎨 <b>Категория:</b> ${categoryNames[session.data.category]}
📄 <b>Описание:</b> ${session.data.description || 'Без описания'}

Проверьте данные и подтвердите сохранение:
      `;

      // Отправляем фото с предпросмотром
      await sendTelegramPhoto(
        botToken,
        userId,
        session.data.photo_url,
        preview,
        getConfirmationKeyboard()
      );

    } catch (error) {
      console.error('❌ Ошибка обработки описания:', error);
      await sendTelegramMessage(botToken, userId, '❌ Произошла ошибка. Попробуйте еще раз.', null);
    }
  };

  const confirmSave = async (userId: number, botToken: string) => {
    try {
      const session = getSession(userId);
      if (!session || session.step !== 'confirming') {
        await sendTelegramMessage(botToken, userId, '❌ Сессия истекла. Начните заново.', null);
        return;
      }

      // Сохраняем в базу данных
      const { data, error } = await supabase
        .from('portfolio')
        .insert({
          title: session.data.title,
          category: session.data.category,
          image_url: session.data.photo_url,
          description: session.data.description || null,
          is_featured: false
        })
        .select()
        .single();

      if (error) throw error;

      deleteSession(userId);

      await sendTelegramMessage(
        botToken,
        userId,
        `✅ <b>Фотография успешно добавлена в портфолио!</b>\n\n📊 ID: ${data.id}\n🕐 Время: ${new Date().toLocaleString('ru-RU')}`,
        {
          inline_keyboard: [
            [
              { text: '➕ Добавить еще фото', callback_data: 'add_portfolio' },
              { text: '🔙 Главное меню', callback_data: 'main_menu' }
            ]
          ]
        }
      );

      console.log('✅ Портфолио добавлено:', data.id);

    } catch (error) {
      console.error('❌ Ошибка сохранения в портфолио:', error);
      await sendTelegramMessage(
        botToken,
        userId,
        `❌ <b>Ошибка сохранения:</b>\n${error.message}\n\n🔄 Попробуйте еще раз.`,
        {
          inline_keyboard: [
            [{ text: '🔄 Повторить', callback_data: 'confirm_save' }],
            [{ text: '🔙 Главное меню', callback_data: 'main_menu' }]
          ]
        }
      );
    }
  };

  return {
    processPhotoUpload,
    processTitleInput,
    processCategorySelection,
    processDescriptionInput,
    confirmSave,
    getCategoryKeyboard,
    getConfirmationKeyboard
  };
};
