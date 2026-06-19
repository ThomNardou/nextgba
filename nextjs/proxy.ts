import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function proxy(request: NextRequest) {
    const cookies = request.cookies.get("session");

    if (!cookies) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    
}