// Rewrites vanity URLs like /showname to /?src=showname so each podcast
// gets its own trackable link without any dynamic route folders.

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // single path segment, safe chars only (e.g. /lennyspodcast)
  const m = pathname.match(/^\/([a-zA-Z0-9-_]{1,60})$/);
  if (!m) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("src", m[1]);
  return NextResponse.rewrite(url);
}

export const config = {
  // skip api routes, next internals, and files with extensions
  matcher: ["/((?!api|_next|.*\\..*).+)"],
};
