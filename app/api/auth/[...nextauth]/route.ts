import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const handler = NextAuth(authConfig);

// Explicitly define the HTTP methods
export const GET = handler;
export const POST = handler;
