import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users?email=xxx
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const filter = email ? { email: email.toLowerCase().trim() } : {};
    const users = await User.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcılar alınamadı" },
      { status: 500 }
    );
  }
}

// POST /api/users — Kullanıcı oluştur veya mevcut olanı döndür (upsert)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Ad ve e-posta zorunludur" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { name: name.trim(), email: email.toLowerCase().trim() },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı oluşturulamadı" },
      { status: 500 }
    );
  }
}
