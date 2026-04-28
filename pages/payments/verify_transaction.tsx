"use client";

import { useState } from "react";

export default function VerifyTransactionTest() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const testVerify = async () => {
    setLoading(true);
    setResponse(null);

    const payload = {
      api_key: "whyehyehhrjkk", // Replace with your test key
      reference: "REF_8804218602177616638082570000997", // Replace with a real ref
    };

    try {
      const res = await fetch("http://localhost:3000/payments/verify_transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Failed to connect to backend" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2>API Tester: Verify Transaction</h2>
      
      <button 
        onClick={testVerify} 
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#635bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {loading ? "Verifying..." : "Run Verify Transaction"}
      </button>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Response State:</strong></p>
          <pre style={{ 
            background: "#f4f4f4", 
            padding: "15px", 
            borderRadius: "8px",
            border: "1px solid #ddd" 
          }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}