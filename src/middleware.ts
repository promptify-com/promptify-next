import { NextRequest, NextResponse, userAgent } from "next/server";

export function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const viewport = device.type === "mobile" ? "mobile" : "desktop";

  request.nextUrl.searchParams.set("viewport", viewport);

  return NextResponse.rewrite(request.nextUrl);
}
