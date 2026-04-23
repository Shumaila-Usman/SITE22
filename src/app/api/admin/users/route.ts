import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

const CreateUserSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(6),
  role:     z.enum(["admin", "user"]).default("user"),
  company:  z.string().optional(),
  country:  z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const role   = searchParams.get("role") ?? "";
  const page   = parseInt(searchParams.get("page") ?? "1");
  const limit  = parseInt(searchParams.get("limit") ?? "20");

  const query: Record<string, unknown> = {
    // Never show the currently logged-in admin in the list
    _id: { $ne: session.userId },
  };
  if (search) query.$or = [
    { name:  { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
  ];
  if (role) query.role = role;

  const [users, total] = await Promise.all([
    User.find(query).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  return NextResponse.json({ users, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await connectDB();

  const exists = await User.findOne({ email: parsed.data.email });
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const hashed = await bcrypt.hash(parsed.data.password, 12);
  const user = await User.create({ ...parsed.data, password: hashed });

  return NextResponse.json({ user: { ...user.toObject(), password: undefined } }, { status: 201 });
}
