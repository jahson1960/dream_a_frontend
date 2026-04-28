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

  //const reference = params.get("reference") || params.get("trxref");
  const reference = 'REF_8804218602177616638082570000997';
  useEffect(() => {
    if (!reference) return;

    fetch(`http://localhost:3000/payments/verify_gateway_payment?reference=${reference}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);

        // Auto redirect after 5s (optional)
        setTimeout(() => {
          //router.push("/");
          window.location.href = res.client_callback_url;
        }, 5000);
      })
      .catch(() => {
        setLoading(false);
        setData({ status: false, data: { status: "failed" } });
      });
  }, [reference]);

  if (loading) {
    return (
      <div className="center">
        <p>Processing payment...</p>
      </div>
    );
  }

  const isSuccess = data?.data?.status === "success";

  return (
    <div className="container">
      <div className="card">
        
        {/* ICON */}
        <div className={`icon ${isSuccess ? "success" : "failed"}`}>
          {isSuccess ? "✔" : "✕"}
        </div>

        {/* TITLE */}
        <h2>
          {isSuccess ? "Payment successful" : "Payment failed"}
        </h2>

        {/* SUBTEXT */}
        <p className="sub">
          {isSuccess
            ? "Your payment has been processed successfully."
            : "We couldn’t process your payment."}
        </p>

        {/* DETAILS */}
        {data?.data && (
          <div className="details">
            {data.data.reference && <p>Ref: {data.data.reference}</p>}
            {data.data.amount && <p>Amount: ₦{data.data.amount / 100}</p>}
            {data.data.customer?.email && <p>{data.data.customer.email}</p>}
          </div>
        )}

        {/* ACTION */}
        <button
          disabled={loading || !data?.client_callback_url}
          onClick={() => {
            if (data?.client_callback_url) {
              window.location.href = data.client_callback_url;
            }
          }}
        >
          Continue
        </button>

        <p className="redirect-note">
          Redirecting in 5 seconds...
        </p>

      </div>

      {/* RAW JSON DISPLAY */}
      <div className="json-debug">
        <p><strong>Raw Debug Info:</strong></p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>

      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f6f9fc;
        }

        .json-debug {
          margin-top: 30px;
          text-align: left;
          background: #272822;
          color: #f8f8f2;
          padding: 15px;
          border-radius: 8px;
          font-size: 11px;
          overflow-x: auto;
          max-height: 250px;
        }

        pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .card {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          width: 360px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
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

        .success {
          background: #e6f9f0;
          color: #00a86b;
        }

        .failed {
          background: #fdecea;
          color: #d93025;
        }

        h2 {
          margin-bottom: 10px;
          font-weight: 600;
        }

        .sub {
          color: #6b7280;
          font-size: 14px;
        }

        .details {
          margin-top: 20px;
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
        }

        button:disabled {
          background: #a3a3a3;
          cursor: not-allowed;
        }

        .redirect-note {
          margin-top: 10px;
          font-size: 12px;
          color: #999;
        }

        .center {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}