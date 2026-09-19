const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

// ============================================================
//  UBAH DUA BARIS INI SESUAI KEINGINANMU
// ============================================================
const NEW_EMAIL    = 'dolongkatanya@gmail.com';   // ← ganti email di sini
const NEW_PASSWORD = 'SuperAdmin2026';  // ← ganti password di sini
// ============================================================

async function main() {
  const db = new Database(path.join(__dirname, 'db.sqlite'));

  // Cari akun superadmin yang ada (berdasarkan role)
  const existing = db.prepare("SELECT id, email FROM users WHERE role = 'superadmin' LIMIT 1").get();

  if (!existing) {
    console.log('❌ Tidak ada akun superadmin di database.');
    db.close();
    return;
  }

  console.log(`📋 Akun superadmin ditemukan: ${existing.email}`);

  // Hash password baru
  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

  // Update email, password, dan reset mustChangePassword
  db.prepare(`
    UPDATE users
    SET email = ?, password = ?, mustChangePassword = 0
    WHERE id = ?
  `).run(NEW_EMAIL, hashedPassword, existing.id);

  // Hapus semua login attempt lama (bersihkan rate limit)
  db.prepare("DELETE FROM login_attempts WHERE email = ?").run(existing.email);
  db.prepare("DELETE FROM login_attempts WHERE email = ?").run(NEW_EMAIL);

  // Hapus semua refresh token lama (paksa login ulang)
  db.prepare("DELETE FROM refresh_tokens WHERE userId = ?").run(existing.id);

  // Verifikasi hasil
  const updated = db.prepare("SELECT id, email, role, isActive, mustChangePassword FROM users WHERE id = ?").get(existing.id);
  console.log('\n✅ Superadmin berhasil diperbarui!');
  console.log('----------------------------------');
  console.log(`   Email baru    : ${updated.email}`);
  console.log(`   Password baru : ${NEW_PASSWORD}`);
  console.log(`   Role          : ${updated.role}`);
  console.log(`   mustChangePwd : ${updated.mustChangePassword ? 'Ya (harus ganti saat login)' : 'Tidak'}`);
  console.log('----------------------------------');
  console.log('\n⚠️  Jangan lupa update juga file .env agar konsisten:');
  console.log(`   SUPERADMIN_EMAIL=${NEW_EMAIL}`);
  console.log(`   SUPERADMIN_PASSWORD=${NEW_PASSWORD}`);

  db.close();
}

main().catch(console.error);
