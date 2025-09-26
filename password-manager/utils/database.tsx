import * as SQLite from 'expo-sqlite';





export function createUserTable() {
  const db = SQLite.openDatabaseSync('password_manager.db'); 
  const query = `
    CREATE TABLE IF NOT EXISTS USER (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      master_password TEXT NOT NULL,
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
        user_id INTEGER NOT NULL, 
        account_name TEXT NOT NULL, 
        account_username TEXT NOT NULL,
        encrypted_pass TEXT NOT NULL, 
        iv TEXT NOT NULL, url TEXT, 
        add_date TEXT, expiry_date TEXT, 
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





    export async function insertMasterUser(username: string, master_password: string, first_name?: string, last_name?: string, phone_number?: string) {

        const db =  SQLite.openDatabaseSync('password_manager.db'); 
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

       try {
        db.execSync(query);
      console.log('User sucesfully inserted');
    } catch (error) {
      console.error('Error inserting user', error);
    }
        
}



    export async function verifyMasterUser(username: string, master_password: string) {
      const db =  SQLite.openDatabaseSync('password_manager.db'); 
 const query = `
    SELECT user_id FROM USER WHERE
      user_name = '${username}' AND  master_password = '${master_password}'
    );
  `;



       try {
        db.execSync(query);
      console.log('User sucesfully logged in');
    } catch (error) {
      console.error('Error logging user', error);
    }
              




    }