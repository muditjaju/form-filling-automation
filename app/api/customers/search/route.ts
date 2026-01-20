import { NextResponse } from "next/server";
import { FetchAPIs } from "@/server/FetchAPIs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, error: "email is required" }, { status: 400 });
  }

  const result = await FetchAPIs.searchCustomerByEmail(email);
  return NextResponse.json(result);
}
