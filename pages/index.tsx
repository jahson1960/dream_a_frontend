import Link from 'next/link';

export default function Home() {
  return (
    <div style={{fontFamily:'Arial',padding:20}}>
      <h1>Payments Test (Next.js)</h1>
      <ul>
        <li><Link href="/init">Initialize payment (form)</Link></li>
        <li><Link href="/verify">Verify (callback page)</Link></li>
      </ul>
    </div>
  );
}
