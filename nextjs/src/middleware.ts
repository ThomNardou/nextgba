import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const cookies = request.cookies.get("session");

    console.log("Cookies:", cookies);

    if (!cookies) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
