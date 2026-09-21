import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "@/shared/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await decryptSession(token) : null;

  if (!session || !session.isStaffOrAdmin) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
