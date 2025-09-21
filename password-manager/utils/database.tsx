import * as SQLite from 'expo-sqlite'; 
export async function createUserTable () { 
  const db = await SQLite.openDatabaseAsync('password_manager.db'); 
  const query = `CREATE TABLE IF NOT EXISTS USER (
   user_id INTEGER PRIMARY KEY AUTOINCREMENT,
   username TEXT NOT NULL UNIQUE,
    master_password TEXT NOT NULL, 
   first_name TEXT, 
   last_name TEXT, 
   phone_number TEXT );`; 
   try { 
    const response = await db.execAsync(query); 
    console.log("Database created", response); 
  } 
  catch (error) { 
    console.error("Error creating database:", error);
   } 
  }; 
    
    
    
    export async function createPasswordTable() { 
        const db = await SQLite.openDatabaseAsync('password_manager.db'); 
        const query = ` CREATE TABLE IF NOT EXISTS passwords 
        ( password_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user_id INTEGER NOT NULL, account_name TEXT NOT NULL, 
        account_username TEXT NOT NULL, encrypted_pass TEXT NOT NULL, 
        iv TEXT NOT NULL, url TEXT, add_date TEXT, expiry_date TEXT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ); `; 
          try { 
          const response = await db.execAsync(query); 
          console.log("Database created", response); 
        } 
        catch (error) {
          console.error("Error creating database:", error); 
        } 
      } 
        
      export async function initDatabase() { 
        await SQLite.openDatabaseAsync('password_manager.db'); 
        await createUserTable(); 
        await createPasswordTable();
       }





    export async function insertMasterUser(username: string, master_password: string, first_name?: string, last_name?: string, phone_number?: string) {

        const db = await SQLite.openDatabaseAsync('password_manager.db'); 
        const query = `
    INSERT INTO USER 
      (username, master_password, first_name, last_name, phone_number)
    VALUES (
      '${username}',
      '${master_password}',
      '${first_name}',
      '${last_name}',
      '${phone_number}'
    );
  `;

        const response = await db.execAsync(query); 

          



       }