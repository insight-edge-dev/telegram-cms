import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // 🔥 1 MIN BUFFER (avoid delay issue)
    const now = new Date(Date.now() + 60 * 1000).toISOString();

    console.log("⏳ CRON RUNNING AT:", now);

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", now);

    if (error) {
      console.log("❌ DB ERROR:", error);
      return NextResponse.json({ error });
    }

    console.log("📦 POSTS FOUND:", posts);

    for (const post of posts || []) {
      try {
        for (const channel of post.channels) {
          try {
            const res = await fetch(
              `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  chat_id: channel,
                  text: post.text,
                  reply_markup: {
                    inline_keyboard: post.buttons,
                  },
                }),
              }
            );

            const data = await res.json();
            console.log("👉 TELEGRAM:", data);

            // 🔥 SAVE LOG (SUCCESS / FAIL)
            const { error: logError } = await supabase.from("logs").insert([
              {
                post_id: post.id,
                channel,
                status: data.ok ? "success" : "failed",
                response: data,
                error: data.ok ? null : JSON.stringify(data),
              },
            ]);

            if (logError) {
              console.log("❌ LOG INSERT ERROR:", logError);
            }

          } catch (err: any) {
            console.log("❌ CHANNEL ERROR:", err);

            // 🔥 LOG ERROR
            await supabase.from("logs").insert([
              {
                post_id: post.id,
                channel,
                status: "failed",
                error: err.message,
              },
            ]);
          }
        }

        // ✅ mark post as sent
        await supabase
          .from("posts")
          .update({ status: "sent" })
          .eq("id", post.id);

      } catch (err: any) {
        console.log("❌ POST ERROR:", err);

        // 🔥 fallback log
        await supabase.from("logs").insert([
          {
            post_id: post.id,
            channel: "unknown",
            status: "failed",
            error: err.message,
          },
        ]);
      }
    }

    return NextResponse.json({
      success: true,
      processed: posts?.length || 0,
    });

  } catch (err) {
    console.log("❌ CRON ERROR:", err);
    return NextResponse.json({ error: "Cron failed" });
  }
}