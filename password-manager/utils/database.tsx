import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

async function hashPassword(password: string, salt: string) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    salt + password
  );
}

function generateSalt(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createUserTable() {
  const db = SQLite.openDatabaseSync('password_manager.db');
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

export  function createPasswordTable() { 
        const db = SQLite.openDatabaseSync('password_manager.db');
        
        const query = ` CREATE TABLE IF NOT EXISTS passwords 
        ( password_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id INTEGER NOT NULL, account_name TEXT NOT NULL, 
        account_username TEXT NOT NULL, encrypted_pass TEXT NOT NULL, 
        iv TEXT NOT NULL, url TEXT, add_date TEXT, expiry_date TEXT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ); `; 
           try {
      db.execSync(query);
      console.log('Password table created successfully');
    } catch (error) {
      console.error('Error creating PASSWORD table', error);
    }

      } 
        


export async function initDatabase() { 
         const db = SQLite.openDatabaseSync('password_manager.db') as any; 
         createUserTable(); 
         createPasswordTable();
}






export async function insertMasterUser(
  username: string,
  master_password: string,
  first_name?: string,
  last_name?: string,
  phone_number?: string
) {
  const db = SQLite.openDatabaseSync('password_manager.db');
  const existing = db.getFirstSync(
    `SELECT * FROM USER WHERE username = ?`,
    [username]
  );

  if (existing) {
    console.error("Username already exists");
    return { success: false, message: "Username already exists" };
  }

  const salt = generateSalt();
  const hashedPassword = await hashPassword(master_password, salt);

  const query = `
    INSERT INTO USER (username, master_password, salt, first_name, last_name, phone_number)
    VALUES ('${username}', '${hashedPassword}', '${salt}', '${first_name}', '${last_name}', '${phone_number}');
  `;

  try {
    db.execSync(query);
    console.log('User successfully inserted');
    return { success: true, message: "User successfully created" };
  } catch (error) {
    console.error('Error inserting user', error);
    return { success: false, message: "User failed to be created" };
  }
}

export async function verifyMasterUser(username: string, master_password: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  const query = `SELECT user_id, master_password, salt FROM USER WHERE username = ?;`;

  try {
    const user: any = db.getFirstSync(query, [username]); 

    if (!user) {
      console.log('Invalid username or password');
      return { success: false, message: 'Invalid username or password' };
    }

    const hashedInput = await hashPassword(master_password, user.salt);

    if (hashedInput === user.master_password) {
      console.log('User successfully logged in');
      return { success: true, message: 'Logged in', userId: user.user_id };
    } else {
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
  description: string,
  username: string,
  encryptedPassword: string,
  iv: string,
  url?: string,
  add_date?: string,
  expiry_date?: string
) {
  const db = SQLite.openDatabaseSync('password_manager.db');
  const existing = db.getFirstSync(
    `SELECT * FROM PASSWORD WHERE user_id = ? AND account_username = ?`,
    [userId, username]
  );

  

  

  if (existing) {
    console.error("Account already exists for this user");
    return { success: false, message: "Account already exists" };
  }

  const query = `
    INSERT INTO PASSWORD (user_id, account_name, account_username, encrypted_pass, iv, url, add_date, expiry_date)
    VALUES ('${userId}', '${description}', '${username}', '${encryptedPassword}', '${iv}', '${url}', '${add_date}', '${expiry_date}');
  `;

  try {
    db.execSync(query);
    console.log('Password successfully inserted');
    return { success: true, message: "Password successfully created" };
  } catch (error) {
    console.error('Error inserting password', error);
    return { success: false, message: "Failed to create password" };
  }
}
