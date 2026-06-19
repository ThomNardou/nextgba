"use client";

import { useState } from "react";

export default function Login() {
  const [pin, setPin] = useState(["", "", "", ""]);

  return (
    <>
      <div className={"w-full h-screen content-center"}>
        <div
          className={
            "w-1/4 aspect-square mx-auto shadow-lg rounded-lg border border-gray-200"
          }
        >
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <h1 className="max-w-5xl text-2xl font-bold leading-none tracking-tighter md:text-5xl lg:text-6xl lg:max-w-7xl bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              NextGBA
            </h1>
            <p className="text-gray-500">Enter your 4-digit PIN to login</p>
          </div>
          <div className="flex items-center justify-center gap-4 p-8">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(-1);
                  setPin((prev) => {
                    const next = [...prev];
                    next[index] = val;
                    return next;
                  });
                  if (val) {
                    const inputs = Array.from(
                      e.target.parentElement!.querySelectorAll("input"),
                    );
                    if (index < inputs.length - 1) inputs[index + 1].focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digit && index > 0) {
                    const inputs = Array.from(
                      e.currentTarget.parentElement!.querySelectorAll("input"),
                    );
                    inputs[index - 1].focus();
                  }
                }}
                className="w-16 h-16 text-center text-2xl rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 p-8">
            <button
              disabled={pin.some((digit) => digit === "")}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 w-4/5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                const pinValue = pin.join("");
                console.log("Logging in with PIN:", pinValue);
                // Add your login logic here
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
