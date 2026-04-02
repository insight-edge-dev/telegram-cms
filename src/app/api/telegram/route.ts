import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, buttons, channels, image_url } = await req.json();

  const token = process.env.TELEGRAM_BOT_TOKEN;

  const results = [];

  for (const channel of channels) {
    let res;

    // 🔥 IF IMAGE EXISTS → sendPhoto
    if (image_url) {
      res = await fetch(
        `https://api.telegram.org/bot${token}/sendPhoto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: channel,
            photo: image_url,
            caption: text || "",
            reply_markup: {
              inline_keyboard: buttons || [],
            },
          }),
        }
      );
    } else {
      // 🔥 NORMAL TEXT
      res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: channel,
            text,
            reply_markup: {
              inline_keyboard: buttons || [],
            },
          }),
        }
      );
    }

    const data = await res.json();

    console.log("👉 TELEGRAM RESPONSE:", data);
    console.log("👉 CHANNEL:", channel);

    results.push(data);
  }

  return NextResponse.json(results);
}