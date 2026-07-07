import { NextResponse } from "next/server";
import { getAIConfigStatus } from "@/config/models";

export const runtime = "nodejs";

export async function GET() {
  const status = getAIConfigStatus();

  return NextResponse.json(status, {
    status: status.configured ? 200 : 503,
  });
}
