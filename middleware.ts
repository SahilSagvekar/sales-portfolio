import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";

  if (!hostname.endsWith(".yourdomain.com")) {
    return NextResponse.next();
  }

  const slug = hostname.replace(".yourdomain.com", "");
  if (slug === "www") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${slug}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|videos|images|_vercel).*)"],
};