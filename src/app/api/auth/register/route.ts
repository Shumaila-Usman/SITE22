import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company:  z.string().optional(),
  country:  z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors
        ? Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Invalid input"
        : "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      name:     parsed.data.name,
      email:    parsed.data.email.toLowerCase(),
      password: hashed,
      role:     "user",
      company:  parsed.data.company,
      country:  parsed.data.country,
      isActive: true,
    });

    const res = NextResponse.json({
      user: {
        id:      user._id.toString(),
        name:    user.name,
        email:   user.email,
        company: user.company,
        country: user.country,
      },
    }, { status: 201 });

    // Set user_id cookie so server-side design APIs can identify the user
    res.cookies.set("user_id", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
