import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { serverEnv } from "@/shared/config/server-env";

const SESSION_COOKIE = "elimi_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days — bounds refresh-token lifetime, not access-token lifetime

const encodedSecret = new TextEncoder().encode(serverEnv.sessionSecret);

export type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  /** Computed server-side from a real /me call — never trust a client-supplied value here. */
  isStaffOrAdmin: boolean;
};

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(encodedSecret);
}

export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, encodedSecret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

/** Reads + verifies the session cookie for the current request. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decryptSession(token);
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** For proxy.ts, which reads cookies off the request directly rather than via next/headers. */
export const SESSION_COOKIE_NAME = SESSION_COOKIE;
