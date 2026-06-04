import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host?.startsWith("www.")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.hostname = host.replace(/^www\./, "");
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: "/:path*",
};
