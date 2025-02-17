import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// NextAuth() returns an object with "auth" and "handlers" properties in App Router
const { handlers } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;
