import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Block admin accounts from logging in via the customer portal
    if (user.role === "admin") {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const res = NextResponse.json({
      user: {
        id:      user._id.toString(),
        name:    user.name,
        email:   user.email,
        company: user.company,
        country: user.country,
      },
    });

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
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
