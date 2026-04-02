import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fiveDaysAgo = new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000
    ).toISOString();

    // 🔥 get old sent posts with images
    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, image_url")
      .eq("status", "sent")
      .not("image_url", "is", null)
      .lte("image_created_at", fiveDaysAgo);

    if (error) throw error;

    let deletedCount = 0;

    for (const post of posts) {
      try {
        // 🔥 extract file path
        const filePath = post.image_url.split("/post-images/")[1];

        if (!filePath) continue;

        // 🔥 delete from storage
        const { error: storageError } = await supabase.storage
          .from("post-images")
          .remove([filePath]);

        if (storageError) {
          console.error("STORAGE DELETE ERROR:", storageError);
          continue;
        }

        // 🔥 update DB
        await supabase
          .from("posts")
          .update({ image_url: null })
          .eq("id", post.id);

        deletedCount++;
      } catch (err) {
        console.error("DELETE LOOP ERROR:", err);
      }
    }

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
    });
  } catch (err) {
    console.error("CLEANUP ERROR:", err);
    return NextResponse.json(
      { error: "Cleanup failed" },
      { status: 500 }
    );
  }
}