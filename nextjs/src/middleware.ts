import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    console.log("MW →", request.nextUrl.pathname);
    const token = request.cookies.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const res = await fetch(`${request.nextUrl.origin}/api/login`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token.value}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Session verification failed:", data.message);
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } catch (error) {
        console.error("Error verifying session:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|login|_next/static|_next/image|favicon.ico|.well-known).*)"],
};