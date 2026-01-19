import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/server/supabase/client";

export async function POST(request: Request) {
  try {
    const { email, pin, role } = await request.json();

    if (!email || !pin || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role === 'customer') {
      const { data: customer, error: customerError } = await supabase
        .from("customer-data")
        .select("*")
        .eq("email", email)
        .eq("pin", pin)
        .single();

      if (customerError || !customer) {
        return NextResponse.json(
          { error: "Invalid email or PIN" },
          { status: 401 }
        );
      }

      const cookieStore = await cookies();
        
        cookieStore.set("ROLE", role, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        });

        cookieStore.set("PIN", pin, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        });

        cookieStore.set("EMAIL", email, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        });

        cookieStore.set("ID", customer.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        });

        return NextResponse.json({ success: true, message: "Logged in successfully", id: customer.id, role: role });
    }

    // Supabase check
    const { data: admin, error: dbError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("pin", pin)
      .single();

    if (dbError || !admin) {
      return NextResponse.json(
        { error: "Invalid email or PIN" },
        { status: 401 }
      );
    }

    // Set cookies
    const cookieStore = await cookies();
    
    cookieStore.set("ROLE", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    cookieStore.set("PIN", pin, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    cookieStore.set("EMAIL", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Logged in successfully", id: admin.id, role: role });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
