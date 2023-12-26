import { NextRequest, NextResponse, userAgent } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const { device, ua } = userAgent(request);
  let viewport = device.type === "mobile" ? "mobile" : "desktop";

  if (ua.toLowerCase().includes("amazon cloudfront")) {
    viewport = "unknown";
  }

  request.nextUrl.searchParams.set("viewport", viewport);

  return NextResponse.rewrite(request.nextUrl);
}
