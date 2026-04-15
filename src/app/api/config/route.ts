import { NextRequest, NextResponse } from "next/server";
import { getConfig, saveConfig, configExists } from "@/lib/config";

export async function GET() {
  if (!configExists()) {
    return NextResponse.json({ exists: false }, { status: 404 });
  }
  return NextResponse.json({ exists: true, config: getConfig() });
}

export async function PUT(request: NextRequest) {
  const config = await request.json();
  saveConfig(config);
  return NextResponse.json({ success: true });
}
