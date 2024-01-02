import { NextRequest, NextResponse, userAgent } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};

export function middleware(request: NextRequest) {
  const { device, ua } = userAgent(request);
  let viewport = device.type === "mobile" ? "mobile" : "desktop";

  if (ua?.toLowerCase()?.includes("amazon cloudfront")) {
    viewport = "unknown";
  }

  let variant = "unknown";

  if (request.url.includes("/prompt/") && request.cookies.has("promptify_variant")) {
    const variantCookie = request.cookies.get("promptify_variant");
    variant = variantCookie?.value ? variantCookie.value : variant;
  }

  request.nextUrl.searchParams.set("viewport", viewport);
  request.nextUrl.searchParams.set("variant", variant);

  return NextResponse.rewrite(request.nextUrl);
}
