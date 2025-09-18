import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('password_manager.db');

export async function createUserTable () {

    const query = `CREATE TABLE IF NOT EXISTS USER (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        master_password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        phone_number TEXT
      );`;
        await db.execAsync(query);
};



export async function createPasswordTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS passwords (
      password_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      account_name TEXT NOT NULL,
      account_username TEXT NOT NULL,
      encrypted_pass TEXT NOT NULL,
      iv TEXT NOT NULL,
      url TEXT,
      add_date TEXT,
      expiry_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );
  `;
  await db.execAsync(query);
}


