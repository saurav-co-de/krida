# 📋 Manual Setup Guide - TurfBooker Application

This document outlines **everything you need to do manually** to get the TurfBooker application running on your computer.

## ✅ STEP-BY-STEP SETUP CHECKLIST

### STEP 1: Install Node.js (Required)
**What:** Node.js is the runtime that allows you to run JavaScript on your computer.

**How:**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for your operating system
3. Run the installer
4. Follow the installation wizard (keep all default settings)
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.17.0 and 9.6.7)

**Why:** Without Node.js, the application cannot run.

---

### STEP 2: Extract the Project Files
**What:** Unzip the project folder.

**How:**
1. Locate the `turf-booking-app.zip` file
2. Right-click → Extract All (Windows) or Double-click (Mac)
3. Choose a location (e.g., Desktop or Documents)
4. Remember this location - you'll need it!

---

### STEP 3: Install Backend Dependencies
**What:** Install the required libraries for the backend server.

**How:**

**On Windows:**
1. Open Command Prompt or PowerShell
2. Navigate to the backend folder:
   ```bash
   cd path\to\turf-booking-app\backend
   ```
3. Run:
   ```bash
   npm install
   ```
4. Wait for installation to complete (2-3 minutes)

**On Mac/Linux:**
1. Open Terminal
2. Navigate to the backend folder:
   ```bash
   cd path/to/turf-booking-app/backend
   ```
3. Run:
   ```bash
   npm install
   ```
4. Wait for installation to complete (2-3 minutes)

**Expected Output:** You'll see a progress bar and eventually "added X packages"

---

### STEP 4: Install Frontend Dependencies
**What:** Install the required libraries for the frontend.

**How:**

**On Windows:**
1. In the same Command Prompt/PowerShell, go to frontend:
   ```bash
   cd ..\frontend
   ```
2. Run:
   ```bash
   npm install
   ```
3. Wait for installation (3-5 minutes)

**On Mac/Linux:**
1. In the same Terminal, go to frontend:
   ```bash
   cd ../frontend
   ```
2. Run:
   ```bash
   npm install
   ```
3. Wait for installation (3-5 minutes)

**Expected Output:** You'll see "added X packages" when done

---

### STEP 5: Start the Application
**What:** Run both the backend and frontend servers.

**Option A: Using Start Scripts (Easiest)**

**On Windows:**
1. Double-click `start-app.bat` in the project root folder
2. Two command windows will open
3. Wait 10-20 seconds
4. Your browser should open automatically to `http://localhost:3000`

**On Mac/Linux:**
1. Open Terminal
2. Navigate to project root:
   ```bash
   cd path/to/turf-booking-app
   ```
3. Make the script executable:
   ```bash
   chmod +x start-app.sh
   ```
4. Run it:
   ```bash
   ./start-app.sh
   ```
5. Your browser should open automatically to `http://localhost:3000`

**Option B: Manual Start (Better for troubleshooting)**

**Terminal/Command Prompt 1 (Backend):**
```bash
cd path/to/turf-booking-app/backend
npm start
```
Wait for "Server is running on http://localhost:5000"

**Terminal/Command Prompt 2 (Frontend):**
```bash
cd path/to/turf-booking-app/frontend
npm start
```
Wait for "Compiled successfully!" and browser to open

---

### STEP 6: Access the Application
**What:** Open the application in your web browser.

**How:**
1. If browser didn't open automatically, go to: `http://localhost:3000`
2. You should see the TurfBooker home page
3. Backend API is at: `http://localhost:5000/api`

---

## 🎯 THAT'S IT! Your application is now running.

## 📝 What You DON'T Need to Do

❌ No database setup required (uses JSON files)
❌ No environment configuration needed (works out of the box)
❌ No code compilation needed (handled automatically)
❌ No server deployment needed (runs locally)

## 🔍 Common Issues & Solutions

### Issue 1: "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH
1. Reinstall Node.js
2. Make sure to check "Add to PATH" during installation
3. Restart your computer

### Issue 2: "Port 5000 already in use"
**Solution:** Another application is using port 5000
1. Close any other servers running
2. Or change the port in `backend/server.js`:
   ```javascript
   const PORT = 5001; // Change to any free port
   ```

### Issue 3: "Port 3000 already in use"
**Solution:** Another React app is running
1. Close other React applications
2. Or press 'Y' when asked "Would you like to run on another port?"

### Issue 4: npm install fails with permission error
**Solution on Mac/Linux:**
```bash
sudo npm install
```
Enter your password when prompted

**Solution on Windows:**
Run Command Prompt as Administrator

### Issue 5: Nothing happens when I run npm start
**Solution:**
1. Make sure you're in the correct directory
2. Check that `package.json` exists in that directory
3. Try deleting `node_modules` and running `npm install` again

## 🛑 Stopping the Application

**Option 1: If using start scripts**
- Close both terminal/command windows

**Option 2: If running manually**
- Press `Ctrl + C` in each terminal/command window
- Confirm with `Y` if asked

## 📊 Testing the Application

Once running, try these:
1. ✅ Browse turfs on the home page
2. ✅ Filter by sport (Cricket, Badminton, Tennis, Football)
3. ✅ Search for a turf
4. ✅ Click on a turf to view details
5. ✅ Book a time slot
6. ✅ View your bookings (use the email you entered)
7. ✅ Cancel a booking

## 🚀 Next Steps (Optional Enhancements)

After the basic setup works, you can:

1. **Add Real Database** (PostgreSQL, MongoDB, MySQL)
2. **Add Payment Gateway** (Stripe, Razorpay)
3. **Add Email Notifications** (SendGrid, Nodemailer)
4. **Deploy to Production** (Heroku, AWS, Vercel)
5. **Add User Authentication** (JWT, OAuth)

See README.md for detailed enhancement instructions.

## 📞 Still Having Issues?

If you've followed all steps and still have problems:
1. Check that Node.js version is 14 or higher
2. Make sure you have a stable internet connection (for npm install)
3. Try running as administrator (Windows) or with sudo (Mac/Linux)
4. Clear npm cache: `npm cache clean --force`
5. Delete `node_modules` folders and reinstall

---

**Remember:** The application runs completely on your local machine. No internet required after installation!
