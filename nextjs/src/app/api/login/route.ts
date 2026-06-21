import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import * as fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface SessionData {
  token: string;
}

interface Sessions {
  [key: string]: SessionData;
}

export async function GET() {
  const cookie = (await cookies()).get("token")?.value;

  if (!cookie) {
    console.log("No session cookie found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secretKey = fs.readFileSync("data/secret.txt", "utf-8");
    if (!secretKey) {
      console.error("Secret key not found");
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    const decoded = jwt.verify(cookie, secretKey) as string;
    console.log("Decoded token:", decoded);

    const sessionsPath = "data/sessions.json";
    if (!fs.existsSync(sessionsPath)) {
      console.error("Sessions file not found");
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    const sessionsData: Sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));

    if (!sessionsData[cookie]) {
      console.error("Session not found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const hashedpin = fs.readFileSync("data/pin.txt", "utf-8");

    const tokenMatches = await bcrypt.compare(decoded, hashedpin);
    if (!tokenMatches) {
      console.error("Invalid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Authorized" });
    response.cookies.set("token", cookie, { httpOnly: true, path: "/" });
    return response;



  } catch (error) {
    console.error("Invalid token");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

}

export async function POST(request: Request) {


  const { pin } = await request.json();

  if (!pin) {
    return NextResponse.json({ error: "Pin is required" }, { status: 400 });
  }

  const pinPath = "data/pin.txt";
  if (!fs.existsSync(pinPath)) {
    // Create the pin.txt file with the user provided pin
    const hashedPin = await bcrypt.hash(pin, 12);
    fs.writeFileSync(pinPath, hashedPin);
  }

  const storedPin = fs.readFileSync(pinPath, "utf-8");
  const pinMatches = await bcrypt.compare(pin, storedPin);

  if (!pinMatches) {
    return NextResponse.json({ error: "Invalid pin" }, { status: 401 });
  }

  const secretKey = fs.readFileSync("data/secret.txt", "utf-8");
  if (!secretKey) {
    console.error("Secret key not found");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  // Generate JWT token with the pin as payload and no expiration
  const token = jwt.sign(pin, secretKey);


  const sessionsPath = "data/sessions.json";
  let sessionsData: Sessions = {};

  if (fs.existsSync(sessionsPath)) {
    sessionsData = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
  }

  sessionsData[token] = { token };
  fs.writeFileSync(sessionsPath, JSON.stringify(sessionsData));

  const response = NextResponse.json({ message: "Login successful" });
  (await cookies()).set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  })
  return response;

}