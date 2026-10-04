# HunarSetu (हुनर सेतु) - Local Setup Guide for Windows

This guide provides exact, copy-pasteable commands for running HunarSetu locally on a standard Windows 10/11 laptop (PowerShell or Command Prompt).

---

## 1. Prerequisites (Software Required)
1. **Node.js**: Version 18.x, 20.x, or 22.x LTS ([Download Node.js](https://nodejs.org/))
   - Verify by running in PowerShell / CMD:
     ```cmd
     node -v
     npm -v
     ```
2. **Git** (Optional, for version control): ([Download Git](https://git-scm.com/))
3. **Web Browser**: Chrome, Edge, Brave, or Firefox.

---

## 2. Quick One-Click Start (Windows)
Double-click:
```cmd
start-dev.bat
```
This automatically verifies dependencies and launches the application at `http://localhost:3000`.

---

## 3. Manual Step-by-Step Setup via PowerShell / CMD

### Step A: Clone or Navigate to Project Folder
```cmd
cd path\to\hunarsetu
```

### Step B: Environment Configuration
Copy `.env.example` to `.env`:
```cmd
copy .env.example .env
```
*(Note: If you have a Gemini API key, add `GEMINI_API_KEY=your_key` into `.env`. HunarSetu features an automated deterministic **Demo Mode** fallback, so it runs seamlessly even without an external API key!)*

### Step C: Install Dependencies
```cmd
npm install
```

### Step D: Start the Development Server
```cmd
npm run dev
```

### Step E: Open in Browser
Open:
```
http://localhost:3000
```

---

## 4. Verification & Testing
- **Typecheck & Linting**:
  ```cmd
  npm run lint
  ```
- **Production Build Test**:
  ```cmd
  npm run build
  ```

---

## 5. Stopping the Server
Press `Ctrl + C` in the running PowerShell/CMD terminal, or run:
```cmd
stop-dev.bat
```

---

## 6. Common Windows Issues & Solutions
1. **Port 3000 already in use**:
   Run `stop-dev.bat` or run:
   ```cmd
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```
2. **ExecutionPolicy error in PowerShell** (`cannot be loaded because running scripts is disabled`):
   Run in PowerShell:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
   or simply run via standard Windows Command Prompt (`cmd.exe`).

## 7. MySQL Database (Student & Parent Accounts)

Student and parent registration/login is stored in MySQL. Passwords are **hashed**; plaintext passwords are not stored.

### A. Install and start MySQL
Make sure MySQL Server is running and that you can open MySQL Workbench or the MySQL command line.

### B. Create the database
From the project folder, run this in MySQL Workbench:
```sql
SOURCE data/hunarsetu_schema.sql;
```
Or open `data/hunarsetu_schema.sql` and execute it.

### C. Configure `.env`
Copy `.env.example` to `.env` and set your MySQL password:
```env
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="YOUR_MYSQL_PASSWORD"
MYSQL_DATABASE="hunarsetu_db"
```

### D. Start the app
```cmd
npm install
npm run dev
```

The first time a student/parent registers, the account is written to the `users` table. On later visits they use the same email/password to log in and their account remains saved in MySQL.


## Student/Parent account storage
The app automatically creates the configured account database and `users` table on first account action when the configured MySQL server is reachable. Keep the MySQL password in `.env`; never put it in frontend code.
