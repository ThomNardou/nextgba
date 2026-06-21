export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const fs = await import("node:fs");
    const crypto = await import("node:crypto");

    if (!fs.existsSync("data")) {
      fs.mkdirSync("data");
    }

    if (!fs.existsSync("data/secret.txt")) {
      const secretKey = crypto.randomBytes(32).toString("hex");
      fs.writeFileSync("data/secret.txt", secretKey);
    }

    if (!fs.existsSync("data/sessions.json")) {
      fs.writeFileSync("data/sessions.json", JSON.stringify({}));
    }



  }
}
