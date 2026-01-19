import { NextResponse } from "next/server";
import { supabase } from "@/server/supabase/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("customer-data")
      .update({ data: body })
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Data updated successfully" });
  } catch (error) {
    console.error("Submit form API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
