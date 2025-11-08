import * as SQLite from 'expo-sqlite';
import { hashPassword, generateSalt } from './hashing';
import { encrypt } from './encryption';

export function createUserTable() {
  console.log('Dropping and creating USER table...');
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
    } 
    else {
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

const { encrypted, iv } = await encrypt(encryptedPassword);


  const query = `
    INSERT INTO PASSWORD (user_id, account_name, account_username, encrypted_pass, iv, url, add_date, expiry_date, notes)
    VALUES ('${userId}', '${accountName}', '${accountUsername}', '${encrypted}', '${iv}', '${url  }', '${add_date }', '${expiry_date }', '${notes }');
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


export async function retrievePassword(userId: number) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  console.log('Retrieving passwords for user:', userId);

  try {
    const results = db.getAllSync(
  `SELECT * FROM PASSWORD WHERE user_id = ${userId}`
);


    if (results.length > 0) {
      return { success: true, data: results };
    } 
    else {
      return { success: false, message: "No passwords found for this user." };
    }

  } catch (error) {
    console.error('Error retrieving passwords:', error);
    return { success: false, message: "Failed to retrieve passwords." };
  }
}


export async function updatePassword(  userid: number,passwordid: number,password: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  const { encrypted, iv } = await encrypt(password);


  console.log('Retrieving passwords for user:', password);

  try {
    const results = db.getAllSync(
  `UPDATE PASSWORD 
   SET encrypted_pass = '${encrypted}', iv = '${iv}' 
   WHERE user_id = ${userid} AND password_id = ${passwordid}`
);
  console.log(`Password updated successfully for user_id: ${userid}`);
    return { success: true, message: 'Password updated successfully.' };
    
    

  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, message: 'Failed to update password.' };
  }
}



export async function updateUsername(userid: number,passwordid: number, username: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  //sanitizes input
  const safeUsername = username.replace(/'/g, "''");

  console.log('Updating username for user_id:', userid);

  try {
    const results = db.getAllSync(
      `UPDATE PASSWORD SET account_username = '${safeUsername}' WHERE user_id = ${userid} AND password_id= ${passwordid}`
    );

    console.log(`Username updated successfully for user_id: ${userid}`);

    return { success: true, message: 'Username updated successfully.' };

  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'Failed to update username.' };
  }
}




export async function updateName(userid: number,passwordid:number, name: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  //sanitizes input
  const safeName = name.replace(/'/g, "''");

  console.log('Updating username for user_id:', userid);

  try {
    const results = db.getAllSync(
      `UPDATE PASSWORD SET account_name = '${safeName}' WHERE user_id = ${userid} AND password_id= ${passwordid}`
    );

    console.log(`Username updated successfully for user_id: ${userid}`);

    return { success: true, message: 'Username updated successfully.' };

  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'Failed to update username.' };
  }
}



export async function updateURL(userid: number,passwordid:number, url: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  //sanitizes input
  const safeURL = url.replace(/'/g, "''");

  console.log('Updating username for user_id:', userid);

  try {
    const results = db.getAllSync(
      `UPDATE PASSWORD SET url = '${safeURL}'WHERE user_id = ${userid} AND password_id= ${passwordid}`
    );

    console.log(`Username updated successfully for user_id: ${userid}`);

    return { success: true, message: 'Username updated successfully.' };

  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'Failed to update username.' };
  }
}



export async function updateAddDate(userid: number, passwordid:number,add_date: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  //sanitizes input
  const safeAddURL = add_date.replace(/'/g, "''");

  console.log('Updating username for user_id:', userid);

  try {
    const results = db.getAllSync(
      `UPDATE PASSWORD SET add_date = '${safeAddURL}' WHERE user_id = ${userid} AND password_id= ${passwordid}`
    );

    console.log(`Username updated successfully for user_id: ${userid}`);

    return { success: true, message: 'Username updated successfully.' };

  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'Failed to update username.' };
  }
}



export async function updateExpiryDate(userid: number,passwordid:number, expiry_date: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  //sanitizes input
  const safeExpiryDate = expiry_date.replace(/'/g, "''");

  console.log('Updating username for user_id:', userid);

  try {
    const results = db.getAllSync(
      `UPDATE PASSWORD SET expiry_date = '${safeExpiryDate}' WHERE user_id = ${userid} AND password_id= ${passwordid}`
    );

    console.log(`Username updated successfully for user_id: ${userid}`);

    return { success: true, message: 'Username updated successfully.' };

  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'Failed to update username.' };
  }
}





export async function updateNotes(userid: number,passwordid:number, notes: string) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  //sanitizes input
  const safeNotes = notes.replace(/'/g, "''");

  console.log('Updating username for user_id:', userid);

  try {
    const results = db.getAllSync(
      `UPDATE PASSWORD SET expiry_date = '${safeNotes}' WHERE user_id = ${userid} AND password_id= ${passwordid}`
    );

    console.log(`Username updated successfully for user_id: ${userid}`);

    return { success: true, message: 'Username updated successfully.' };

  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'Failed to update username.' };
  }
}





export async function deletePassword(userid: number,passwordid:number) {
  const db = SQLite.openDatabaseSync('password_manager.db');

  //sanitizes input

  console.log('Updating username for user_id:', userid);

  try {
    const results = db.getAllSync(
      `DELETE FROM PASSWORD WHERE user_id = ${userid} AND password_id= ${passwordid}`
    );

    console.log(`Username updated successfully for user_id: ${userid}`);

    return { success: true, message: 'Deleted successfully.' };

  } catch (error) {
    console.error('Error updating username:', error);
    return { success: false, message: 'Failed to update username.' };
  }
}
