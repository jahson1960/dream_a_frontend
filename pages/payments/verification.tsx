"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type PaymentData = {
  status: boolean;
  message?: string;
  data?: {
    status: "success" | "failed";
    reference?: string;
    amount?: number;
    customer?: {
      email?: string;
    };
  };
  client_callback_url?: string;
};

export default function PaymentVerifyPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaymentData | null>(null);

  const reference = params?.get("reference") || params?.get("ref") || 'REF_8804218602177616638082570000997';
  //const reference = 'REF_8804218602177616638082570000997';
  useEffect(() => {
    if (!reference) return;

    fetch(`http://localhost:3000/payments/verify_gateway_payment?reference=${reference}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);

        if (res.client_callback_url) {
          setTimeout(() => {
            window.location.href = res.client_callback_url;
          }, 5000);
        }
      })
      .catch(() => {
        setLoading(false);
        setData({ status: false, data: { status: "failed" } });
      });
  }, [reference]);

  // --- LOADING STATE (Now matches the card design) ---
  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
          <h2>Verifying Payment</h2>
          <p className="sub">Please wait while we confirm your transaction with the bank...</p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  const isSuccess = data?.data?.status === "success";

  return (
    <div className="container">
      <div className="card">
        <div className={`icon ${isSuccess ? "success" : "failed"}`}>
          {isSuccess ? "✔" : "✕"}
        </div>

        <h2>{isSuccess ? "Payment successful" : "Payment failed"}</h2>

        <p className="sub">
          {isSuccess
            ? "Your payment has been processed successfully."
            : "We couldn’t process your payment."}
        </p>

        {data?.data && (
          <div className="details">
            {data.data.reference && <p>Ref: {data.data.reference}</p>}
            {data.data.amount && <p>Amount: ₦{data.data.amount / 100}</p>}
            {data.data.customer?.email && <p>{data.data.customer.email}</p>}
          </div>
        )}

        <button
          disabled={!data?.client_callback_url}
          onClick={() => {
            if (data?.client_callback_url) {
              window.location.href = data.client_callback_url;
            }
          }}
        >
          Continue
        </button>

        {data?.client_callback_url && (
          <p className="redirect-note">Redirecting in 5 seconds...</p>
        )}
      </div>

      {/* Debug view is outside the card */}
      {/* <div className="json-debug">
        <p><strong>Raw Debug Info:</strong></p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}

      <style jsx>{styles}</style>
    </div>
  );
}

// Extracted styles to keep code clean
const styles = `
  .container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f6f9fc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .card {
    background: #fff;
    padding: 40px;
    border-radius: 12px;
    width: 360px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  }

  /* SPINNER STYLES */
  .spinner-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #635bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
  }

  .success { background: #e6f9f0; color: #00a86b; }
  .failed { background: #fdecea; color: #d93025; }

  h2 { margin-bottom: 10px; font-weight: 600; color: #1a1f36; }
  .sub { color: #6b7280; font-size: 14px; line-height: 1.5; }

  .details {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 13px;
    color: #444;
  }

  button {
    margin-top: 25px;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    background: #635bff;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  button:hover { background: #4b45e4; }
  button:disabled { background: #a3a3a3; cursor: not-allowed; }

  .redirect-note { margin-top: 15px; font-size: 12px; color: #999; }

  .json-debug {
    margin-top: 30px;
    width: 360px;
    background: #272822;
    color: #f8f8f2;
    padding: 15px;
    border-radius: 8px;
    font-size: 11px;
    overflow-x: auto;
    max-height: 200px;
  }
  pre { margin: 0; white-space: pre-wrap; }
`;