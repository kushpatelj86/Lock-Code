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

- ** User Authentication** – Secure login using bcrypt-hashed master passwords  
- ** AES-256-GCM Encryption** – All passwords encrypted before storage  
- ** Password Generator** – Generate strong, customizable passwords  
- ** Account Management** – Add, edit, delete, and categorize accounts  
- ** Password Strength Indicator** – Assess if passwords are weak, medium, or strong  
- ** Secure Clipboard Copy** – Auto-clears after a short timeout  
- ** Show/Hide Toggle** – Reveal or hide stored passwords  
- ** Search & Filter** – Quickly find accounts by name, username, or keyword  
- ** Local Secure Storage** – Encrypted SQLite3 database on your device  
- ** Auto-Logout** – Locks the vault after inactivity  
- ** Clean UI** – React Native + Tailwind CSS interface  

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
