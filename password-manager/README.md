#  LockCode – Desktop Password Manager

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built With React Native](https://img.shields.io/badge/Built%20With-React%20Native-blue)](https://reactnative.dev/)
[![Electron](https://img.shields.io/badge/Electron-Yes-orange)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-brightgreen)](https://nodejs.org/)

---

## Overview

**LockCode** is a secure desktop application designed to help users store, manage, and generate strong passwords safely. It uses strong encryption, secure authentication, and an intuitive interface. All passwords are encrypted locally — no cloud storage, no plaintext storage, no tracking.

> **Note:** Users must create an account and sign in with their master password to access the vault and all features.


---

## Features

- **User Authentication** – Secure login using bcrypt-hashed master passwords  
- **AES-256-GCM Encryption** – All passwords encrypted before storage  
- **Password Generator** – Generate strong, customizable passwords  
- **Account Management** – Add, edit, delete, and categorize accounts  
- **Password Strength Indicator** – Assess if passwords are weak, medium, or strong  
- **Secure Clipboard Copy** – Auto-clears after a short timeout  
- **Show/Hide Toggle** – Reveal or hide stored passwords  
- **Search & Filter** – Quickly find accounts by name, username, or keyword  
- **Local Secure Storage** – Encrypted SQLite3 database on your device  
- **Auto-Logout** – Locks the vault after inactivity  
- **Clean UI** – React Native + Tailwind CSS interface  

---

## Technologies Used

- React Native  
- Electron  
- SQLite3  
- AES-256-GCM Encryption  
- bcrypt  
- Tailwind CSS  
- JavaScript  
- Node.js  

---

## Installation

### Prerequisites

- Node.js installed  
- Git installed  
- Desktop OS:  macOS

### Steps to Run Locally

```bash
# Clone the repository
git clone https://github.com/kushpatelj86/Lock-Code.git

# Navigate into the project directory
cd Lock-Code

# Navigate to directory to run code
cd password-manager

# Install dependencies
npm install

# Start the desktop application
npx expo start
```


---

## Getting Started

### Launching the Application
- **Action:** Click on the Desktop Application icon.  
- **Result:** Displays the **Login Page**.  
- **Precondition:** User has access to the desktop.  
- **Postcondition:** User is authenticated or prompted to create a new account.  

### Account Creation
- **Sign Up:** Clicking **Sign Up** redirects the user to the **Sign Up Page**.  
- **Back to Login:** Users can return to the Login Page if they already have an account.  
- **Postcondition:** User account is securely created or redirected to Login.

### Logging In
- **Action:** Enter your master credentials on the Login Page.  
- **Postcondition:** User is authenticated and navigated to the **Home Page**.

### Home Page Navigation
- **Vault Access:** View all saved passwords.  
- **Add Account:** Add new account credentials.  
- **Precondition:** User is logged in.  
- **Postcondition:** Relevant screen is displayed.

---

## Vault Features

### Viewing Accounts
- Displays all saved accounts with usernames and encrypted passwords.  

### Search / Filter
- Quickly find accounts using keywords or filters.  

### Add / Edit / Delete Accounts
- Add new accounts, modify existing account details, or delete accounts with confirmation.

### Show / Hide Password
- Toggle password visibility for convenience and security.

### Copy to Clipboard
- Copy username or password temporarily; clears automatically after a short timeout.

---

## Security Features

### Password Generation
- Generates strong and unique passwords based on optional rules (length, symbols, numbers).  

### Password Strength Evaluation
- Categorizes passwords as weak, medium, or strong with actionable suggestions.

### Encryption & Storage
- Passwords stored using **AES-256 GCM** encryption.  
- Master password hashed with **bcrypt**.  
- All credentials stored securely in an encrypted SQLite database.  

### Automatic Logout
- User is automatically logged out after a period of inactivity to ensure security.

---

