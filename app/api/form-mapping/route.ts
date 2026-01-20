import { NextRequest, NextResponse } from "next/server";
import { FetchAPIs } from "@/server/FetchAPIs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Clean the URL: strip query params, fragments, and trailing slash
    try {
      const parsedUrl = new URL(url);
      url = parsedUrl.origin + parsedUrl.pathname;
    } catch (e) {
      // In case the URL is not valid, we still try basic cleaning if it looks like a relative path or something
      url = url.split("?")[0].split("#")[0];
    }

    // Remove trailing slash if present
    if (url.endsWith("/") && url.length > 1) {
      url = url.slice(0, -1);
    }

    console.log(`[API] Fetching mapping for cleaned URL: ${url}`);

    const result = await FetchAPIs.getFormMapping(url);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error("Form mapping API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
