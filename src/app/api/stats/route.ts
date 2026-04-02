import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("status");

    if (error) throw error;

    const total = data.length;
    const pending = data.filter((p) => p.status === "pending").length;
    const sent = data.filter((p) => p.status === "sent").length;

    return NextResponse.json({
      total,
      pending,
      sent,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}