import * as SQLite from 'expo-sqlite';
import { hashPassword, generateSalt } from './hashing';

export function createUserTable() {
  console.log('Dropping and creating USER table...');
  const db = SQLite.openDatabaseSync('password_manager.db');

  db.execSync(`DROP TABLE IF EXISTS USER;`);

  const query = `
    CREATE TABLE IF NOT EXISTS USER (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      master_password TEXT NOT NULL,
      salt TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone_number TEXT
    );
  `;
  try {
    db.execSync(query);
    console.log('USER table created successfully');
  } catch (error) {
    console.error('Error creating USER table', error);
  }
}

export function createPasswordTable() {
  console.log('Dropping and creating passwords table...');
  const db = SQLite.openDatabaseSync('password_manager.db');


  const query = `
    CREATE TABLE IF NOT EXISTS PASSWORD (
      password_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      account_name TEXT NOT NULL,
      account_username TEXT NOT NULL,
      encrypted_pass TEXT NOT NULL,
      iv TEXT NOT NULL,
      url TEXT,
      add_date TEXT,
      expiry_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES USER(user_id)
    );
  `;
  try {
    db.execSync(query);
    console.log('Password table created successfully');
  } catch (error) {
    console.error('Error creating PASSWORD table', error);
  }
}

export async function initDatabase() {
  console.log('Initializing database...');
  createUserTable();
  createPasswordTable();
  console.log('Database initialization complete');
}


export async function insertMasterUser(
  username: string,
  master_password: string,
  first_name?: string,
  last_name?: string,
  phone_number?: string
) {
  console.log('Inserting master user:', username);
  const db = SQLite.openDatabaseSync('password_manager.db');

  console.log('Checking if username already exists...');
  const existing = db.getFirstSync(
    `SELECT * FROM USER WHERE username = ?`,
    [username]
  );

  if (existing) {
    console.error("Username already exists:", username);
    return { success: false, message: "Username already exists" };
  }

  console.log('Generating salt and hashing password...');
  const salt = generateSalt();
  const hashedPassword = await hashPassword(master_password, salt);
  console.log('Generated salt:', salt);
  console.log('Hashed password:', hashedPassword);

  const query = `
    INSERT INTO USER (username, master_password, salt, first_name, last_name, phone_number)
    VALUES ('${username}', '${hashedPassword}', '${salt}', '${first_name ?? ''}', '${last_name ?? ''}', '${phone_number ?? ''}');
  `;

  try {
    db.execSync(query);
    console.log('User successfully inserted:', username);
    return { success: true, message: "User successfully created" };
  } catch (error) {
    console.error('Error inserting user', error);
    return { success: false, message: "User failed to be created" };
  }
}

export async function verifyMasterUser(username: string, master_password: string) {
  console.log('Verifying user:', username);
  const db = SQLite.openDatabaseSync('password_manager.db');

  const query = `
    SELECT user_id, master_password, salt 
    FROM USER 
    WHERE username = '${username}';
  `;

  try {
    console.log('Querying database for user...');
    const user: any = db.getFirstSync(query);

    if (!user) {
      console.log('user does not exist');
      return { success: false, message: 'Invalid username or password' };
    }

    console.log('Retrieved user from DB:', user);
    console.log("Input password:", master_password);
    console.log("User salt:", user.salt);

    const hashedInput = await hashPassword(master_password, user.salt);
    console.log("Hashed input password:", hashedInput);

    if (hashedInput === user.master_password) {
      console.log('User successfully logged in');
      return { success: true, message: 'Logged in', userId: user.user_id };
    } else {
      console.log("hashed inout ",hashedInput );
            console.log("user.master_password ",user.master_password );

      console.log('Invalid username or password');
      return { success: false, message: 'Invalid username or password' };
    }
  } catch (error) {
    console.error('Error logging user', error);
    return { success: false, message: 'Login failed due to error' };
  }
}

export async function insertPassword(
  userId: number,
  accountName: string,
  accountUsername: string,
  encryptedPassword: string,
  iv: string,
  url: string,
  add_date?: string,
  expiry_date?: string,
  notes?: string
) {
  console.log(`Inserting PASSWORD for userId=${userId}, account=${accountName}`);
  const db = SQLite.openDatabaseSync('password_manager.db');

  console.log('Checking if account already exists...');
  const existing = db.getFirstSync(
    `SELECT * FROM PASSWORD WHERE user_id = ? AND account_username = ?`,
    [userId, accountUsername]
  );

  if (existing) {
    console.error("Account already exists for this user:", accountUsername);
    return { success: false, message: "Account already exists" };
  }

  const query = `
    INSERT INTO PASSWORD (user_id, account_name, account_username, encrypted_pass, iv, url, add_date, expiry_date, notes)
    VALUES ('${userId}', '${accountName}', '${accountUsername}', '${encryptedPassword}', '${iv}', '${url  }', '${add_date }', '${expiry_date }', '${notes }');
  `;

  try {
    db.execSync(query);
    console.log('Password successfully inserted for account:', accountName);
    return { success: true, message: "Password successfully created" };
  } catch (error) {
    console.error('Error inserting password', error);
    return { success: false, message: "Failed to create password" };
  }
}
