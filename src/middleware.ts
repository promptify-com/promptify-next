import { type NextRequest, NextResponse } from "next/server";
import { getDeviceType } from "./common/helpers/ua-parser";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const viewport = getDeviceType(request.headers.get("user-agent"));
  console.log("[Next:middleware]:", {
    au: request.headers.get("user-agent"),
    headers: request.headers,
  });

  request.nextUrl.searchParams.set("viewport", viewport);

  return NextResponse.rewrite(request.nextUrl);
}
