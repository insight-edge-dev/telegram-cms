import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ GET ALL POSTS
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// ✅ CREATE POST
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      text,
      buttons,
      channels,
      scheduled_at,
      status,
      image_url, // 🆕 NEW
    } = body;

    const { data, error } = await supabase.from("posts").insert([
      {
        text,
        buttons,
        channels,
        scheduled_at,
        status,
        image_url: image_url || null, // 🆕 SAVE IMAGE
        image_created_at: image_url
          ? new Date().toISOString()
          : null, // 🆕 FOR AUTO DELETE
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to insert post" },
      { status: 500 }
    );
  }
}

// ✅ DELETE POST
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // 🔥 OPTIONAL: fetch image before delete (for storage cleanup later)
    const { data: post } = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", id)
      .single();

    // ❌ delete row
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}