import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { ADMIN_AUTH_COOKIE, getAdminSessionToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").toLowerCase().trim();
    const password = String(body?.password || "");

    const defaultEmail = (process.env.ADMIN_EMAIL || "admin@meatnspice.local").toLowerCase().trim();
    const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";

    const isDefaultEmail = email === defaultEmail;

    let admin = await prisma.adminUser.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    if (!admin && isDefaultEmail) {
      const passwordHash = await hash(defaultPassword, 12);
      admin = await prisma.adminUser.upsert({
        where: { email: defaultEmail },
        update: {
          passwordHash,
          isActive: true,
          role: "admin",
          name: "Admin",
        },
        create: {
          email: defaultEmail,
          passwordHash,
          isActive: true,
          role: "admin",
          name: "Admin",
        },
      });
    }

    if (admin && isDefaultEmail) {
      const matchesDefaultPassword = await compare(defaultPassword, admin.passwordHash);
      if (!matchesDefaultPassword) {
        const passwordHash = await hash(defaultPassword, 12);
        admin = await prisma.adminUser.update({
          where: { id: admin.id },
          data: {
            passwordHash,
            isActive: true,
            role: "admin",
            name: admin.name || "Admin",
          },
        });
      }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const validPassword = await compare(password, admin.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_AUTH_COOKIE, getAdminSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("[admin/login][POST]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
