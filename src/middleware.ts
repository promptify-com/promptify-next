import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};

export function middleware(request: NextRequest) {
  let variant = "unknown";

  if (request.url.includes("/prompt/") && request.cookies.has("promptify_variant")) {
    const variantCookie = request.cookies.get("promptify_variant");
    variant = variantCookie?.value ? variantCookie.value : variant;
  }

  request.nextUrl.searchParams.set("variant", variant);

  return NextResponse.rewrite(request.nextUrl);
}
