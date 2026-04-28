"use client";

import { useEffect, useState } from "react";
import { fetchClients } from "../../lib/clients";

interface Client {
  id: number;
  username: string;
  email: string;
  account_number: string;
  kyc_status: string;
  status: string;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [offset, setOffset] = useState(0);
  const limit = 10;

  const totalPages = Math.ceil(total / limit);
  const currentPage = offset / limit + 1;

  const loadClients = async () => {
    setLoading(true);

    try {
      const res = await fetchClients(limit, offset);

      console.log("API RESPONSE:", res);

      setClients(res.data || []);
      setTotal(Number(res.total || 0));
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setClients([]);
      setTotal(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, [offset]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Clients</h1>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <p>
            Total Clients: <strong>{total}</strong>
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Account Number</th>
                <th>KYC</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No clients found
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.username}</td>
                    <td>{c.email}</td>
                    <td>{c.account_number}</td>
                    <td>{c.kyc_status}</td>
                    <td>{c.status}</td>
                    <td>{new Date(c.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
              disabled={offset === 0}
            >
              Previous
            </button>

            <span style={{ margin: "0 15px" }}>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() => setOffset((prev) => prev + limit)}
              disabled={offset + limit >= total}
            >
              Next
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #ccc;
          border-top: 4px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        table, th, td {
          border: 1px solid #ddd;
        }

        th, td {
          padding: 10px;
          text-align: left;
        }

        button {
          padding: 8px 12px;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}