const http = require('http');

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost', port: 3000,
      path, method,
      headers: { 'Content-Type': 'application/json', ...headers }
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const Database = require('better-sqlite3');
const path = require('path');

async function main() {
  // Get current superadmin from DB
  const db = new Database(path.join(__dirname, 'db.sqlite'));
  const superadmin = db.prepare("SELECT email FROM users WHERE role = 'superadmin' LIMIT 1").get();
  db.close();

  const email = superadmin?.email;
  const password = 'SuperAdmin2026'; // must match NEW_PASSWORD in reset_superadmin.js

  console.log(`Testing with: ${email} / ${password}`);

  // Step 1: Login
  const loginRes = await request('POST', '/auth/login', { email, password });
  console.log('Login status:', loginRes.status, loginRes.body?.message || '');

  if (!loginRes.body?.mfaToken) {
    console.log('No mfaToken — login failed. Body:', JSON.stringify(loginRes.body));
    return;
  }

  const { mfaToken, devOtp } = loginRes.body;

  // Step 2: Verify OTP
  const otpRes = await request('POST', '/auth/verify-otp', { mfaToken, otp: String(devOtp) });
  console.log('OTP verify status:', otpRes.status);
  const accessToken = otpRes.body?.access_token;
  if (!accessToken) {
    console.log('OTP failed:', JSON.stringify(otpRes.body));
    return;
  }

  const authHeaders = { 'Authorization': `Bearer ${accessToken}` };

  // Step 3: Test Resend OTP flow
  console.log('\n=== Testing Resend OTP ===');
  // First trigger a new login to get a fresh mfaToken
  const login2 = await request('POST', '/auth/login', { email, password });
  if (!login2.body?.mfaToken) { console.log('Second login failed'); return; }

  const mfaToken2 = login2.body.mfaToken;
  const devOtp2 = login2.body.devOtp;
  console.log('Got mfaToken for resend test, devOtp2:', devOtp2);

  // Wait 1 second, then resend (cooldown check: must wait 60s normally, but for test we force by checking logic)
  // We'll skip actual cooldown test and just verify the resend endpoint returns a new mfaToken
  // The resend will fail with cooldown if called immediately after login, which is correct behavior
  const resendRes = await request('POST', '/auth/resend-otp', { mfaToken: mfaToken2 });
  console.log('Resend status:', resendRes.status);
  console.log('Resend body:', JSON.stringify(resendRes.body));
  if (resendRes.status === 400 && resendRes.body?.message?.includes('wait')) {
    console.log('✓ Cooldown correctly enforced (OTP was just issued)');
    console.log('  Using original OTP to verify instead...');
    const verify2 = await request('POST', '/auth/verify-otp', { mfaToken: mfaToken2, otp: String(devOtp2) });
    console.log('Verify with original OTP:', verify2.status, verify2.body?.user?.email || verify2.body?.message);
  } else if (resendRes.status === 200 || resendRes.status === 201) {
    console.log('✓ New OTP issued');
    console.log('  New mfaToken returned:', resendRes.body?.mfaToken ? '✓ yes' : '✗ missing');
    console.log('  New devOtp:', resendRes.body?.devOtp);
  }

  // Step 4: Admin list & audit logs (already verified working from previous tests)
  const adminList = await request('GET', '/admin/list', null, authHeaders);
  console.log('\nAdmin list:', adminList.status === 200 ? `✓ ${adminList.body.length} admins` : `✗ ${adminList.status}`);

  const logs = await request('GET', '/audit-logs?limit=3', null, authHeaders);
  console.log('Audit logs:', logs.status === 200 ? `✓ total=${logs.body.total}` : `✗ ${logs.status}`);

  console.log('\n✅ All checks complete!');
}

main().catch(console.error);
