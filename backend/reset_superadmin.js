const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// ============================================================
//  BACA NILAI DEFAULT DARI .env ATAU ARGUMEN COMMAND LINE
//  Contoh penggunaan:
//    node reset_superadmin.js
//    node reset_superadmin.js dolongkatanya@gmail.com SuperAdmin2026
// ============================================================

const envPath = path.join(__dirname, '.env');
let envEmail = 'dolongkatanya@gmail.com';
let envPassword = 'SuperAdmin2026';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const emailMatch = content.match(/SUPERADMIN_EMAIL\s*=\s*(.+)/);
  const passMatch = content.match(/SUPERADMIN_PASSWORD\s*=\s*(.+)/);
  if (emailMatch && emailMatch[1]) envEmail = emailMatch[1].trim();
  if (passMatch && passMatch[1]) envPassword = passMatch[1].trim();
}

const NEW_EMAIL = process.argv[2] || envEmail;
const NEW_PASSWORD = process.argv[3] || envPassword;

async function main() {
  const db = new Database(path.join(__dirname, 'db.sqlite'));

  // Cari akun superadmin yang ada (berdasarkan role atau email)
  let existing = db.prepare("SELECT id, email FROM users WHERE role = 'superadmin' LIMIT 1").get();
  if (!existing) {
    existing = db.prepare("SELECT id, email FROM users WHERE email = ? LIMIT 1").get(NEW_EMAIL);
  }

  // Hash password baru
  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

  if (!existing) {
    console.log(`⚠️  Akun superadmin belum ada, membuat akun baru...`);
    const info = db.prepare(`
      INSERT INTO users (email, password, name, role, isActive, mustChangePassword, createdAt, updatedAt)
      VALUES (?, ?, 'Master Superadmin', 'superadmin', 1, 0, datetime('now'), datetime('now'))
    `).run(NEW_EMAIL, hashedPassword);
    existing = { id: info.lastInsertRowid, email: NEW_EMAIL };
  } else {
    console.log(`📋 Akun superadmin ditemukan (ID: ${existing.id}, Email lama: ${existing.email})`);
    db.prepare(`
      UPDATE users
      SET email = ?, password = ?, mustChangePassword = 0, isActive = 1,
          resetPasswordTokenHash = NULL, resetPasswordExpiresAt = NULL,
          otpHash = NULL, otpExpiresAt = NULL, otpAttempts = 0,
          updatedAt = datetime('now')
      WHERE id = ?
    `).run(NEW_EMAIL, hashedPassword, existing.id);
  }

  // Hapus semua login attempt lama (membersihkan rate limit lockout)
  db.prepare("DELETE FROM login_attempts WHERE email = ?").run(existing.email);
  db.prepare("DELETE FROM login_attempts WHERE email = ?").run(NEW_EMAIL);

  // Hapus semua refresh token lama (paksa login ulang bersih)
  db.prepare("DELETE FROM refresh_tokens WHERE userId = ?").run(existing.id);

  // Verifikasi hasil
  const updated = db.prepare("SELECT id, email, role, isActive, mustChangePassword FROM users WHERE id = ?").get(existing.id);
  console.log('\n✅ Superadmin berhasil diperbarui & rate limit di-reset!');
  console.log('----------------------------------------------------');
  console.log(`   Email         : ${updated.email}`);
  console.log(`   Password      : ${NEW_PASSWORD}`);
  console.log(`   Role          : ${updated.role}`);
  console.log(`   Status Aktif  : ${updated.isActive ? 'Ya (Aktif)' : 'Tidak'}`);
  console.log(`   mustChangePwd : ${updated.mustChangePassword ? 'Ya' : 'Tidak (Langsung bisa dipakai)'}`);
  console.log('----------------------------------------------------');
  console.log('\n💡 Anda sekarang dapat langsung login di: http://localhost:4200/admin/login');

  db.close();
}

main().catch(console.error);
