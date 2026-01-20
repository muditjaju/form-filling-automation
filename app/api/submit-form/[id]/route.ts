import { NextResponse } from "next/server";
import { supabase } from "@/server/supabase/client";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cookieStore = await cookies();
    const role = cookieStore.get("ROLE")?.value;
    const pin = cookieStore.get("PIN")?.value;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    let query = supabase.from("customer-data").update({ data: body }).eq("id", id);

    const isAdmin = role?.toLowerCase() === "admin";

    if (isAdmin) {
      // TODO: Make sure admin is correct/authorized
      // For now, we update based on form id
    } else {
      // For customers, we must match both ID and PIN
      if (!pin) {
        return NextResponse.json({ error: "Unauthorized: PIN missing" }, { status: 401 });
      }
      query = query.eq("pin", pin);
    }

    const { data, error, count } = await query.select();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update data" },
        { status: 500 }
      );
    }

    // If no rows were affected (especially for customers), it might be a PIN mismatch
    if (!data || data.length === 0) {
        return NextResponse.json(
            { error: isAdmin ? "Record not found" : "Unauthorized: ID or PIN mismatch" },
            { status: isAdmin ? 404 : 403 }
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
