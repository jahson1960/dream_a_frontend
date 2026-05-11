export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

/**
 * Generic helper to call backend
 */
async function callBackend(path: string, body: any) {
  const res = await fetch(`${process.env.BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BACKEND_API_KEY!,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      error: true,
      status: res.status,
      data,
    };
  }

  return data;
}

/**
 * POST /api
 * You route everything through one endpoint
 */
export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();

    // =========================
    // PAYMENT CONFIG
    // =========================
    if (action === "get_payment_config") {
      const result = await callBackend(
        "/payments/get_payment_config",
        payload
      );

      return NextResponse.json(result);
    }

    // =========================
    // LIST CLIENTS
    // =========================
    if (action === "list_clients") {
      const result = await callBackend("/clients/list", payload);

      return NextResponse.json(result);
    }

    // =========================
    // UNKNOWN ACTION
    // =========================
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API ROUTE ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// /app/api/get-payment-config/route.ts

/*import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.BACKEND_URL}/payments/get_payment_config`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY!, //  hidden
      },
      body: JSON.stringify(body),
    }
  );

  return NextResponse.json(await res.json());
}*/

