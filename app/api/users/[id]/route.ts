import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("GET /api/users/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı alınamadı" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const allowedFields: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = body.name?.trim();
      if (!name || name.length < 2 || name.length > 100) {
        return NextResponse.json(
          { success: false, error: "Ad 2-100 karakter arasında olmalıdır" },
          { status: 400 }
        );
      }
      allowedFields.name = name;
    }

    if (body.email !== undefined) {
      const email = body.email?.toLowerCase().trim();
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: "Geçerli bir e-posta adresi girin" },
          { status: 400 }
        );
      }
      allowedFields.email = email;
    }

    const user = await User.findByIdAndUpdate(params.id, allowedFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("PATCH /api/users/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı silinemedi" },
      { status: 500 }
    );
  }
}
