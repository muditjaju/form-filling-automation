import { NextResponse } from "next/server";
import { supabase } from "@/server/supabase/client";

export async function POST(request: Request) {
  try {
    const { id, pin } = await request.json();

    if (!id || !pin) {
      return NextResponse.json(
        { error: "Missing ID or PIN" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("customer-data")
      .select("id")
      .eq("id", id)
      .eq("pin", pin)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Invalid PIN" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, message: "PIN verified" });
  } catch (error) {
    console.error("Verify PIN API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
