import { NextResponse } from "next/server";

export function middleware() {
  // Auth middleware disabled — all routes are publicly accessible
  return NextResponse.next();
}

export const config = {
  matcher: [],
};