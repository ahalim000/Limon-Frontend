import { NextResponse } from "next/server";
import jwt from '@tsndr/cloudflare-worker-jwt'

export const config = {
    matcher: [
        '/((?!_next/static|favicon.ico|login).*)',
    ]
}

export function middleware(req) {
    let cookie = null;
    if (req.cookies.has("session-token")) {
        cookie = req.cookies.get("session-token")?.value;
    }
    let invalid = false;
    // If session-token does not exist, cookie will have a string with the value undefined
    if (cookie !== null) {
        let decodedJWT = jwt.decode(cookie);
        invalid = Date.now() >= decodedJWT.exp * 1000
    }

    if (cookie === null || invalid) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url, req.url);
    }
}