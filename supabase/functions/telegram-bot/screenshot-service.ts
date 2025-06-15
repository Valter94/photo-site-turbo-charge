
export const createScreenshotService = () => {
  const takeScreenshot = async (url: string, elementSelector?: string) => {
    try {
      // Используем сервис скриншотов (например, htmlcsstoimage.com или screenshot.com)
      const screenshotApiKey = Deno.env.get('SCREENSHOT_API_KEY')
      
      if (!screenshotApiKey) {
        console.log('📸 Screenshot API key не настроен')
        return null
      }

      const screenshotUrl = `https://htmlcsstoimage.com/demo_run`
      
      const payload = {
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <script>
                setTimeout(() => {
                  window.location.href = '${url}';
                }, 1000);
              </script>
            </head>
            <body>
              <p>Загрузка сайта...</p>
            </body>
          </html>
        `,
        css: '',
        google_fonts: '',
        selector: elementSelector || 'body',
        ms_delay: 3000,
        device_scale: 1,
        viewport_width: 1200,
        viewport_height: 800
      }

      const response = await fetch(screenshotUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${screenshotApiKey}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        return result.url
      }
      
      return null
    } catch (error) {
      console.error('❌ Ошибка создания скриншота:', error)
      return null
    }
  }

  const takeSimpleScreenshot = async (siteUrl: string) => {
    try {
      // Альтернативный простой способ через screenshot.com API
      const apiKey = Deno.env.get('SCREENSHOT_API_KEY')
      
      if (!apiKey) {
        return null
      }

      const screenshotApi = `https://api.screenshotone.com/take`
      const params = new URLSearchParams({
        access_key: apiKey,
        url: siteUrl,
        viewport_width: '1200',
        viewport_height: '800',
        device_scale_factor: '1',
        format: 'jpg',
        image_quality: '80',
        block_ads: 'true',
        block_cookie_banners: 'true',
        wait_for_selector: 'body',
        delay: '3'
      })

      const response = await fetch(`${screenshotApi}?${params}`)
      
      if (response.ok) {
        const imageBuffer = await response.arrayBuffer()
        return new Uint8Array(imageBuffer)
      }
      
      return null
    } catch (error) {
      console.error('❌ Ошибка создания простого скриншота:', error)
      return null
    }
  }

  return { takeScreenshot, takeSimpleScreenshot }
}
