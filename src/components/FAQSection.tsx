
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Phone, Mail } from 'lucide-react';

const FAQSection = () => {
  const faqData = [
    {
      question: "Как происходит бронирование фотосессии?",
      answer: "Выберите удобную дату в календаре, заполните форму с вашими пожеланиями, и я свяжусь с вами в течение 2 часов для подтверждения деталей. Для фиксации даты требуется предоплата 30%."
    },
    {
      question: "Сколько фотографий я получу?",
      answer: "Количество обработанных фото зависит от продолжительности съемки: 1 час - 20-30 фото, 2 часа - 50-70 фото, 3 часа - 80-120 фото. Все фотографии проходят профессиональную обработку."
    },
    {
      question: "Через какое время я получу готовые фотографии?",
      answer: "Стандартный срок обработки 7-10 дней. За доплату 5000₽ доступна экспресс-обработка за 1-3 дня. Превью (несколько лучших кадров) высылаю в течение 24 часов."
    },
    {
      question: "Можно ли изменить или отменить бронирование?",
      answer: "Изменения возможны не позднее чем за 48 часов до съемки. При отмене менее чем за 24 часа предоплата не возвращается. При форс-мажорах (плохая погода для уличной съемки) переносим бесплатно."
    },
    {
      question: "Что включено в стоимость съемки?",
      answer: "В стоимость включены: фотосъемка, профессиональная обработка, онлайн-галерея для скачивания, консультация по образу и локации. Дополнительно оплачиваются: печать, видеосъемка, второй фотограф."
    },
    {
      question: "Какие локации вы рекомендуете?",
      answer: "У меня есть база из 20+ проверенных локаций в Москве: парки, исторические места, студии, крыши. Помогу выбрать идеальное место под ваш стиль и время года. Также можем снимать в предложенном вами месте."
    },
    {
      question: "Нужно ли готовиться к фотосессии?",
      answer: "Да, подготовка важна! Перед съемкой провожу консультацию по образу, макияжу и позированию. Высылаю гайд по подготовке с рекомендациями по одежде, аксессуарам и уходу за кожей."
    },
    {
      question: "Работаете ли вы в других городах?",
      answer: "Основная работа в Москве и области. В другие города выезжаю при заказе от 3 дней съемки. Дополнительно оплачиваются транспортные расходы и проживание."
    },
    {
      question: "Можно ли посмотреть больше работ?",
      answer: "Конечно! Полное портфолио и актуальные работы смотрите в моем Instagram @irina_photographer. Также могу показать работы в конкретном стиле или локации по запросу."
    },
    {
      question: "Какое оборудование вы используете?",
      answer: "Снимаю на профессиональные камеры Canon и Nikon, использую светосильные объективы и студийный свет при необходимости. Всегда беру резервное оборудование для надежности."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h2>
          <p className="text-xl text-gray-600">
            Ответы на популярные вопросы о фотосессиях
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="px-6">
                  <AccordionTrigger className="text-left hover:text-rose-400 transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-rose-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Онлайн-чат</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Быстрые ответы в WhatsApp</p>
              <a 
                href="https://wa.me/+79262563550" 
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Написать в WhatsApp
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Phone className="h-8 w-8 text-rose-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Телефон</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Звоните с 9:00 до 21:00</p>
              <a 
                href="tel:+79262563550" 
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                +7 (926) 256-35-50
              </a>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-8 w-8 text-rose-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Детальные вопросы по почте</p>
              <a 
                href="mailto:irina@photo.ru" 
                className="inline-block bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors"
              >
                irina@photo.ru
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Не нашли ответ на свой вопрос?</h3>
          <p className="text-gray-600 mb-6">
            Свяжитесь со мной любым удобным способом, и я отвечу в течение часа
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-rose-400 text-white px-6 py-3 rounded-lg hover:bg-rose-500 transition-colors">
              Задать вопрос
            </button>
            <button className="border border-rose-400 text-rose-400 px-6 py-3 rounded-lg hover:bg-rose-400 hover:text-white transition-colors">
              Заказать консультацию
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
