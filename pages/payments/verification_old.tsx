import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Verify() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { reference, trxref } = router.query as any;
    const ref = reference || trxref;
    if (!ref) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/payments/verify?reference=${encodeURIComponent(ref)}`);
        const json = await res.json();
        setResult(json);
      } catch (e) {
        setResult({ error: e.message || String(e) });
      } finally {
        setLoading(false);
      }
    })();
  }, [router.query]);

  return (
    <div style={{fontFamily:'Arial',padding:20}}>
      <h2>Payment Verification</h2>
      {!router.isReady && <p>Waiting for query params...</p>}
      {router.isReady && !router.query.reference && !router.query.trxref && (
        <p>No reference found in URL. Paystack should redirect here with ?reference= or ?trxref=</p>
      )}
      {loading && <p>Verifying...</p>}
      {result && (
        <pre style={{whiteSpace:'pre-wrap',background:'#f6f8fa',padding:12}}>{JSON.stringify(result,null,2)}</pre>
      )}
    </div>
  );
}
