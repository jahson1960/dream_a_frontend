export default function Init() {
  const backendInit = 'http://localhost:3000/payments/initialize';
  const frontendVerify = 'http://localhost:3001/verify';

  return (
    <div style={{fontFamily:'Arial',padding:20,maxWidth:720}}>
      <h2>Initialize Payment</h2>
      <p>This will POST to the backend which redirects to Paystack checkout.</p>

      <form method="post" action={backendInit}>
        <label>Username<br/>
          <input name="username" defaultValue="existingUser" required />
        </label>

        <label>Account number<br/>
          <input name="account_number" defaultValue="8800123456" required />
        </label>

        <label>Email<br/>
          <input name="email" type="email" defaultValue="customer@example.com" required />
        </label>

        <label>Amount (smallest currency unit)<br/>
          <input name="amount" type="number" defaultValue="20000" required />
        </label>

        <label>Currency code<br/>
          <input name="currency_code" defaultValue="NGN" required />
        </label>

        <label>Country code<br/>
          <input name="country_code" defaultValue="NG" required />
        </label>

        <label>Callback (verification) URL<br/>
          <input name="callback_url" defaultValue={frontendVerify} required />
        </label>

        <div style={{marginTop:12}}>
          <button type="submit">Initialize and go to checkout</button>
        </div>
      </form>
    </div>
  );
}
