import { NextResponse } from "next/server";
import { getProviderConnectionById } from "@/lib/localDb";

export const dynamic = "force-dynamic";

// GET /api/providers/mimo-usage?id=<connectionId>
// Fetches plan usage from Xiaomi MiMo platform using stored session cookie
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Connection ID required" }, { status: 400 });
    }

    const connection = await getProviderConnectionById(id);
    if (!connection || connection.provider !== "xiaomi-mimo-plan-sgp") {
      return NextResponse.json({ error: "MiMo SGP connection not found" }, { status: 404 });
    }

    const cookie = connection.providerSpecificData?.platformCookie;
    if (!cookie) {
      return NextResponse.json({ error: "No platform cookie stored. Edit this connection to add one." }, { status: 400 });
    }

    // Fetch user profile from MiMo platform
    const profileRes = await fetch("https://platform.xiaomimimo.com/api/v1/userProfile", {
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "cookie": cookie,
        "referer": "https://platform.xiaomimimo.com/console/plan-manage",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        "x-timezone": "Asia/Jakarta",
      },
    });

    if (!profileRes.ok) {
      const text = await profileRes.text();
      return NextResponse.json({ error: `MiMo platform returned ${profileRes.status}`, detail: text.slice(0, 200) }, { status: 502 });
    }

    const profile = await profileRes.json();

    // Try to fetch plan/usage info
    let planInfo = null;
    try {
      const planRes = await fetch("https://platform.xiaomimimo.com/api/v1/plan/usage", {
        headers: {
          "accept": "*/*",
          "content-type": "application/json",
          "cookie": cookie,
          "referer": "https://platform.xiaomimimo.com/console/plan-manage",
          "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
          "x-timezone": "Asia/Jakarta",
        },
      });
      if (planRes.ok) {
        planInfo = await planRes.json();
      }
    } catch {}

    return NextResponse.json({ profile, plan: planInfo });
  } catch (error) {
    console.log("Error fetching MiMo usage:", error);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
