import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.message) return NextResponse.json({ reply: "กรุณาพิมพ์ข้อความ" }, { status: 400 });

    const SESSION_ID = "crm_fixed_session_2026";


    if (!process.env.N8N_WEBHOOK_URL) {
      console.error("Missing N8N_WEBHOOK_URL in environment variables");
      return NextResponse.json({ reply: "ระบบหลังบ้านยังไม่ได้ตั้งค่า Webhook" }, { status: 500 });
    }

    const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: String(body.message),
        session_id: String(SESSION_ID),
      }),
    });

    // อ่านข้อมูลเป็น Text ก่อนเพื่อเช็คว่ามีค่าไหม
    const text = await response.text();
    console.log("RAW FROM N8N:", text);

    if (!text || text.trim() === "") {
      return NextResponse.json({ reply: "ขออภัย ระบบไม่สามารถตอบกลับได้ในขณะนี้" });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      // ถ้าไม่ใช่ JSON ให้แสดงข้อความตรงๆ
      return NextResponse.json({ reply: text.substring(0, 100) });
    }

    // ดึงคำตอบจากทุก Key ที่เป็นไปได้
    const botReply = data.reply || data.response || data.message || "กำลังประมวลผล...";

    return NextResponse.json({ reply: botReply });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ reply: "เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย" }, { status: 500 });
  }
}
