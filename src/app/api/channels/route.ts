import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  const { data } = await supabase.from("channels").select("*");
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data } = await supabase.from("channels").insert([body]);
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await supabase.from("channels").delete().eq("id", id);
  return NextResponse.json({ success: true });
}