import { NextRequest, NextResponse, userAgent } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const viewport = device.type === "mobile" ? "mobile" : "desktop";

  request.nextUrl.searchParams.set("viewport", viewport);

  return NextResponse.rewrite(request.nextUrl);
}
