const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');
const db = new Database(path.join(__dirname, 'db.sqlite'));

// List all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name).join(', '));

// Find user table
const userTable = tables.find(t => t.name.toLowerCase().includes('user') || t.name.toLowerCase().includes('admin'));
if (userTable) {
  const users = db.prepare(`SELECT id, email, name, role, isActive, mustChangePassword, createdAt FROM "${userTable.name}"`).all();
  console.log('\n=== Users ===');
  users.forEach(u => console.log(JSON.stringify(u)));
}

// Find audit log table
const auditTable = tables.find(t => t.name.toLowerCase().includes('audit'));
if (auditTable) {
  const cols = db.prepare(`PRAGMA table_info("${auditTable.name}")`).all();
  console.log('\n=== Audit Log Columns ===', cols.map(c => c.name).join(', '));
  const logs = db.prepare(`SELECT * FROM "${auditTable.name}" ORDER BY id DESC LIMIT 5`).all();
  console.log('Last 5 logs:');
  logs.forEach(l => console.log(JSON.stringify(l)));
}

db.close();
