import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.N8N_WEBHOOK_URL) {
    return NextResponse.json(
      { error: "N8N_WEBHOOK_URL is not defined" },
      { status: 500 }
    );
  }

  const body = await req.json();

  const r = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET || "",
    },
    body: JSON.stringify(body),
  });

  const data = await r.json().catch(() => ({}));

  // 👇 ดูข้อมูลจาก n8n ใน terminal
  console.log("FROM N8N:", data);

  // 👇 ส่งให้ frontend ใช้ง่าย
  return NextResponse.json({
    reply: data.reply ?? "ขออภัย ระบบไม่สามารถตอบได้ในขณะนี้",
  });
}
