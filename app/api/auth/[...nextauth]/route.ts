import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextRequest } from "next/server";

// Wrap NextAuth inside an async function for App Router compatibility
const handler = NextAuth(authConfig);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
