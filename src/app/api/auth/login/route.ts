import type { NextRequest } from "next/server";
import { completeLoginFromUpstream } from "@/features/auth/server/complete-login";
import type { LoginInput, User } from "@/features/auth/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const input = (await request.json()) as LoginInput;
  return completeLoginFromUpstream<{ user: User }>("/auth/login", input);
}
