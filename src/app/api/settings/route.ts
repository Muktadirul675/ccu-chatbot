import { ChatbotSetting } from "@/globals";
import { getAllSettings, updateAllSettings } from "@/services/settings";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const settings: ChatbotSetting[] = await req.json();

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { message: "Invalid payload format" },
        { status: 400 }
      );
    }

    // ---------------- extract mail config ----------------
    // const mailHost = settings.find((s) => s.key === "mail_host")?.value;
    // const mailUser = settings.find((s) => s.key === "mail_user")?.value;
    // const mailPassword = settings.find((s) => s.key === "mail_password")?.value;

    // ---------------- SMTP validation ----------------
    // if (mailHost && mailUser && mailPassword) {
    //   try {
    //     await testSMTP({
    //       host: mailHost,
    //       user: mailUser,
    //       pass: mailPassword,
    //     });
    //   } catch {
    //     return NextResponse.json(
    //       { message: "SMTP validation failed. Check mail settings." },
    //       { status: 400 }
    //     );
    //   }
    // }

    // ---------------- update settings ----------------
    await updateAllSettings(settings);

    return NextResponse.json(
      { message: "Settings updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}