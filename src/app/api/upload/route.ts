import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    // 🔥 convert file → buffer
    const arrayBuffer = await file.arrayBuffer();

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("UPLOAD CRASH:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}