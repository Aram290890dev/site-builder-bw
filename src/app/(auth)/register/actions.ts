"use server";

import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { signIn } from "@/lib/auth";

export async function register(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashed = await hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}
