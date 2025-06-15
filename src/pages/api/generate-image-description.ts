
import { NextRequest, NextResponse } from "next/server";

// Функция для бэкенда: вызывается с фронта, берет публичную ссылку на фото и отправляет в OpenAI
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return NextResponse.json({ error: "Метод не поддерживается" }, { status: 405 });
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: "Нет ссылки на изображение" }, { status: 400 });
    const prompt = "Опиши это фото для портфолио фотографа кратко, художественно, на русском языке:";

    // Используем OpenAI Vision API (gpt-4o+vision)
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { "role": "system", "content": "Ты помогатель фотографа. Твоё описание должно быть кратким, ёмким, красивым и на русском языке." },
          {
            "role": "user",
            "content": [
              { "type": "text", "text": prompt },
              { "type": "image_url", "image_url": { "url": imageUrl } }
            ]
          }
        ],
        max_tokens: 128
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: err || "Ошибка OpenAI" }, { status: 500 });
    }
    const data = await resp.json();
    const description = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ description });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Непредвиденная ошибка" }, { status: 500 });
  }
}
