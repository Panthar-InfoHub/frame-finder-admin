"use server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cache } from "react";
import { Role } from "@/utils/permissions";

const TOKEN_NAME = "accessToken";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function createSession(token: string) {
  (await cookies()).set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  (await cookies()).delete(TOKEN_NAME);
}

export interface MyJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export const getSession = cache(async () => {
  const token = (await cookies()).get(TOKEN_NAME);
  if (!token) return { user: null };
  try {
    const user = jwt.verify(token.value, JWT_SECRET) as MyJwtPayload;
    return { user };
  } catch (e) {
    return { user: null };
  }
});

export const getAccessToken = cache(async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
});
