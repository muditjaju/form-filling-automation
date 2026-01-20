import { NextResponse } from "next/server";
import { supabase } from "@/server/supabase/client";
import { FetchAPIs } from "@/server/FetchAPIs";

export async function POST(request: Request) {
  try {
    const { email, pin, adminEmail, adminPin } = await request.json();

    if (!email || !pin || !adminEmail || !adminPin) {
      return NextResponse.json(
        { success: false, error: "Email, PIN, and Admin credentials are required" },
        { status: 400 }
      );
    }

    // 1. Verify Admin credentials
    const adminResult = await FetchAPIs.loginAdmin(adminEmail, adminPin);
    
    if (!adminResult.success || !adminResult.data) {
      return NextResponse.json(
        { success: false, error: "Invalid Admin email or PIN" },
        { status: 401 }
      );
    }

    const admin = adminResult.data;

    // 2. Create new customer entry
    const { data: newCustomer, error: insertError } = await supabase
      .from("customer-data")
      .insert([
        { 
          email: email, 
          pin: pin, 
          agent_id: admin.id,
          status: 'IN_PROGRESS',
          data: {} 
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating customer:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to create new form entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Form created successfully", 
      data: newCustomer 
    });
  } catch (error) {
    console.error("Create customer API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
