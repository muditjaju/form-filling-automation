import { NextResponse } from "next/server";
import { FetchAPIs } from "@/server/FetchAPIs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminId = searchParams.get("admin_id");
  const status = searchParams.get("status");

  if (!adminId) {
    return NextResponse.json({ success: false, error: "admin_id is required" }, { status: 400 });
  }

  // We only support IN_PROGRESS for now as per requirements
  if (status !== "IN_PROGRESS") {
    return NextResponse.json({ success: false, error: "Only IN_PROGRESS status is supported" }, { status: 400 });
  }

  const result = await FetchAPIs.fetchInProgressCustomers(adminId);
  return NextResponse.json(result);
}
