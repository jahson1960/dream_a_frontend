"use client";

import { useEffect, useState  } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}


export default function PayPage() {
  const params = useSearchParams();
  const data = params?.get("ref");
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const startPayment = () => {
    if (!data) {
      console.error("Missing payment reference");
      return;
    }

    if (typeof window.FlutterwaveCheckout !== "function") {
      console.error("Flutterwave script not loaded");
      return;
    }

    try {
      // decode config safely
      const decoded = decodeURIComponent(data);
      const config = JSON.parse(atob(decoded));

      console.log("🚀 Starting Flutterwave payment with config:", config);

      const flwPage = window.FlutterwaveCheckout({
        public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY!,
        ...config,

        callback: async (response: any) => {
            const txRef = response?.tx_ref;
            const txId = response?.transaction_id;
            flwPage.close();
            // 2. Show verifying modal
            setVerifying(true);

            // 3. Give React time to render modal
            setTimeout(async () => {
                try {
                const verifyRes = await fetch(
                    process.env.NEXT_PUBLIC_BACKEND_VERIFY_PAYMENT_ENDPOINT!,
                    {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        transaction_id: txId,
                        tx_ref: txRef,
                    }),
                    }
                );

                const result = await verifyRes.json();

                // 4. Delay redirect so user SEES modal
                setTimeout(() => {
                    if (verifyRes.ok && result.success) {
                      setVerifying(false);
                      setSuccess(true);
                      const redirectUrl = result.client_callback_url;
                      setTimeout(() => {
                        window.location.href = redirectUrl;
                      }, 2000); // show success for 2s
                    } else {
                      const redirectUrl = result.client_callback_url;
                      setVerifying(false);
                      setFailed(true);

                      setTimeout(() => {
                        window.location.href = redirectUrl || "";
                      }, 2000);
                    }
                }, 1500); // 👈 show modal for 1.5s

                } catch (error) {
                  setVerifying(false);
                  setFailed(true);

                  setTimeout(() => {
                    window.location.href = "/failed";
                  }, 2000);
                }
            }, 100); // 👈 allow render cycle
            },

        onclose: () => {
          console.log("Payment modal closed");
          window.location.href = "/cancelled";
        },
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
    }
  };

  // start payment when ref is ready
  useEffect(() => {
    if (!data) return;

    let attempts = 0;

    const interval = setInterval(() => {
        attempts++;

        if (typeof window.FlutterwaveCheckout === "function") {
        console.log("Flutterwave ready — starting payment");

        clearInterval(interval);
        startPayment();
        }

        if (attempts > 20) {
        console.error("Flutterwave failed to load");
        clearInterval(interval);
        }
    }, 200);

    return () => clearInterval(interval);
    }, [data]);

  return (
    <>
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        //strategy="afterInteractive"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("🔥 Flutterwave script loaded");
          startPayment();
        }}
      />

      <div
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f9fafb",
        }}
        >
        <div
            style={{
            width: "60px",
            height: "60px",
            border: "5px solid #e5e7eb",
            borderTop: "5px solid #eb6e25",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            }}
        />

        <style>{`
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
        `}</style>
        </div>

      {verifying && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(250, 215, 215, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "30px 40px",
        borderRadius: "12px",
        textAlign: "center",
        minWidth: "250px",
        boxShadow: "0 10px 30px rgba(230, 132, 132, 0.7)",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: 600 }}>
        Processing Payment...
      </div>

      <div style={{ marginTop: "10px", fontSize: "14px", color: "#810909" }}>
        Please wait while we process your payment. Do not close this window.
      </div>

      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            width: "30px",
            height: "30px",
            border: "3px solid #e23434c2",
            borderTop: "3px solid #ec9797",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
          }}
        />
      </div>
    </div>

    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)}

{success && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        textAlign: "center",
        minWidth: "280px",
        animation: "pop 0.3s ease",
      }}
    >
      {/* Checkmark */}
      <div style={{ fontSize: "60px", color: "#22c55e" }}>
        ✔
      </div>

      <div style={{ fontSize: "18px", fontWeight: 600, marginTop: "10px" }}>
        Payment Successful
      </div>

      <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
        Redirecting you safely...
      </div>
    </div>

    <style>{`
      @keyframes pop {
        0% { transform: scale(0.7); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
)}

{failed && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999,
    }}
  >
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        textAlign: "center",
        minWidth: "280px",
        animation: "shake 0.3s ease",
      }}
    >
      {/* Red X Icon */}
      <div style={{ fontSize: "60px", color: "#ef4444" }}>
        ✖
      </div>

      <div style={{ fontSize: "18px", fontWeight: 600, marginTop: "10px" }}>
        Payment Failed
      </div>

      <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
        We couldn’t complete your transaction
      </div>
    </div>

    <style>{`
      @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
      }
    `}</style>
  </div>
)}
    </>
  );
}