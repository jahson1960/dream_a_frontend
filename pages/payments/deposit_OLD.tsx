"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export default function PayPage() {
  const params = useSearchParams();
  const data = params?.get("ref"); // actually BASE64 config

  useEffect(() => {
    const loadScript = () =>
      new Promise<void>((resolve) => {
        if (document.getElementById("flutterwave-script")) return resolve();

        const script = document.createElement("script");
        script.id = "flutterwave-script";
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    const startPayment = async () => {
      if (!data) return;

      const config = JSON.parse(atob(data));

      await loadScript();

      window.FlutterwaveCheckout({
        public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
        ...config,

        callback: async (response: any) => {
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_id: response.transaction_id,
              reference: config.tx_ref,
            }),
          });

          window.location.href = `/success?ref=${config.tx_ref}`;
        },

        onclose: () => {
          window.location.href = "/cancelled";
        },
      });
    };

    loadScript().then(startPayment);
  }, [data]);

  return <p>Initializing payment...</p>;
}