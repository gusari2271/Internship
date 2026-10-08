const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'backend', 'db.sqlite'));

const u = db.prepare("SELECT email, role, isActive, mustChangePassword FROM users WHERE role = 'superadmin'").get();
console.log('Superadmin in DB:', JSON.stringify(u));

const la = db.prepare("SELECT COUNT(*) as cnt FROM login_attempts WHERE isSuccessful = 0 AND attemptedAt > datetime('now', '-15 minutes')").get();
console.log('Recent failed login attempts (all users):', la.cnt);

// Clear rate limit for this email just in case
if (u) {
  const del = db.prepare("DELETE FROM login_attempts WHERE email = ?").run(u.email);
  console.log('Cleared', del.changes, 'login attempts for', u.email);
}

db.close();
console.log('\nSuperadmin Status:');
console.log('  Email   :', u?.email);
console.log('  Password: [Configured via SUPERADMIN_PASSWORD in backend/.env]');
