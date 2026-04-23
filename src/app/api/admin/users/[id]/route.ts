import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const UpdateUserSchema = z.object({
  name:     z.string().min(2).optional(),
  email:    z.string().email().optional(),
  role:     z.enum(["admin", "user"]).optional(),
  company:  z.string().optional(),
  country:  z.string().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const user = await User.findById(id).select("-password").lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();

  const { password, ...rest } = parsed.data;
  const update: Record<string, unknown> = { ...rest };
  if (password) {
    update.password = await bcrypt.hash(password, 12);
  }

  const user = await User.findByIdAndUpdate(id, update, { new: true }).select("-password").lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  // Prevent deleting yourself
  const session2 = await getAdminSession();
  if (session2?.userId === id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
