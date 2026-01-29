# 🎯 VISUAL STUDIO CODE - QUICK START GUIDE

## Welcome to JobShare Pro in VS Code! 🚀

This guide will get you up and running in **Visual Studio Code** in just a few minutes!

---

## 📋 Prerequisites

### 1. Install Visual Studio Code
**Download:** https://code.visualstudio.com/

### 2. Install Node.js (v18 or higher)
**Download:** https://nodejs.org/
- Choose the **LTS (Long Term Support)** version
- Windows: Download and run installer
- Mac: Download .pkg file or use `brew install node`

### 3. Install MongoDB
Choose one option:

**Option A: MongoDB Atlas (Cloud - Recommended)**
- No installation needed!
- Sign up at https://www.mongodb.com/cloud/atlas
- FREE forever for development

**Option B: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and run MongoDB locally

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Open the Project in VS Code

1. **Launch VS Code**
2. Click **"File"** → **"Open Folder"**
3. Navigate to and select the `jobshare-pro` folder
4. Click **"Select Folder"** or **"Open"**

### Step 2: Install Recommended Extensions

VS Code will prompt you to install recommended extensions. Click **"Install All"**.

**Manual Installation (if prompt doesn't appear):**
1. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
2. Search and install these extensions:
   - **ESLint** - Code quality
   - **Prettier** - Code formatting
   - **ES7+ React Snippets** - React shortcuts
   - **MongoDB for VS Code** - Database viewer
   - **Thunder Client** - API testing (Postman alternative)

### Step 3: Open Integrated Terminal

Press `` Ctrl+` `` (backtick) or:
- Menu: **"Terminal"** → **"New Terminal"**

### Step 4: Install All Dependencies

In the terminal, run:

```bash
npm run install:all
```

This installs everything for:
- Root project
- Backend
- Frontend

**Wait 2-3 minutes** for installation to complete.

### Step 5: Set Up Environment Variables

#### Using VS Code:

1. Navigate to `backend` folder in VS Code Explorer (left sidebar)
2. Right-click on `.env.example`
3. Select **"Copy"**
4. Right-click in the `backend` folder
5. Select **"Paste"**
6. Rename the copied file to `.env`
7. Double-click `.env` to open it
8. Edit the values:

```env
# Your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/jobshare
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobshare

# Change this to a random secure string!
JWT_SECRET=your_super_secret_jwt_key_change_this_now

# Leave these as-is:
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Generate a secure JWT_SECRET:**
In terminal, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as your JWT_SECRET.

---

## 🎮 RUNNING THE APPLICATION

### Method 1: Using VS Code Tasks (EASIEST!)

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: **"Tasks: Run Task"**
3. Select: **"Start Full Stack App"**

This starts BOTH backend and frontend automatically! 🎉

You'll see two terminal panels:
- One for **Backend** (Port 5000)
- One for **Frontend** (Port 5173)

### Method 2: Using npm script

In the terminal:
```bash
npm run dev
```

### Method 3: Run Separately (Advanced)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

To open a new terminal: Click the **"+"** button in the terminal panel.

---

## 🌐 Access Your Application

### Frontend (Main App)
- **URL:** http://localhost:5173
- VS Code will show a popup: **"Open in Browser"** → Click it!
- Or manually open your browser and go to the URL

### Backend API
- **URL:** http://localhost:5000/api/health
- Test in browser or use Thunder Client extension

---

## 🛠️ VS CODE FEATURES YOU CAN USE

### 1. Debug the Application

Press `F5` or:
1. Click the **"Run and Debug"** icon (left sidebar, play icon with bug)
2. Select **"Full Stack Debug"** from dropdown
3. Click the green **"Start Debugging"** button

### 2. View MongoDB Database

1. Click **MongoDB** icon in left sidebar (if extension installed)
2. Click **"Add Connection"**
3. Paste your MongoDB connection string
4. Click **"Connect"**
5. Browse your database visually!

### 3. Test API Endpoints

1. Click **Thunder Client** icon in left sidebar
2. Click **"New Request"**
3. Test endpoints like:
   - GET http://localhost:5000/api/health
   - GET http://localhost:5000/api/jobs
   - POST http://localhost:5000/api/auth/register

### 4. Use IntelliSense

- Type in any JavaScript/React file
- VS Code will suggest completions automatically
- Press `Ctrl+Space` for manual suggestions

### 5. Quick Navigation

- `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac) - Quick file search
- `Ctrl+Shift+F` - Search across all files
- `Ctrl+B` - Toggle sidebar
- `Ctrl+J` - Toggle terminal

---

## 📂 PROJECT STRUCTURE IN VS CODE

```
JOBSHARE-PRO/
│
├── 📁 .vscode/              ← VS Code configuration (you're using this!)
│   ├── launch.json          → Debug configurations
│   ├── tasks.json           → Task runners
│   ├── settings.json        → Editor settings
│   └── extensions.json      → Recommended extensions
│
├── 📁 backend/
│   ├── 📁 models/           → Database schemas
│   ├── 📁 routes/           → API endpoints
│   ├── 📁 middleware/       → Auth & security
│   ├── 📄 server.js         → Main server file ⭐ START HERE
│   ├── 📄 package.json
│   └── 📄 .env              → Your configuration
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 pages/        → React page components
│   │   ├── 📁 components/   → Reusable components
│   │   ├── 📄 App.jsx       → Main app ⭐ START HERE
│   │   └── 📄 index.css     → Global styles
│   └── 📄 package.json
│
└── 📄 package.json          → Root scripts
```

---

## 🎨 CUSTOMIZATION IN VS CODE

### Change Colors

1. Open `frontend/src/index.css`
2. Find `:root` section at the top
3. Change color values:

```css
:root {
  --primary: #FF6B35;     /* Change this! */
  --secondary: #004E89;   /* And this! */
  --accent: #FFD23F;      /* And this! */
}
```

4. Save file (`Ctrl+S`)
5. See changes instantly in browser!

### Edit Content

1. Navigate to any `.jsx` file in `frontend/src/pages/`
2. Edit the text
3. Save (`Ctrl+S`)
4. Browser updates automatically!

---

## 🐛 TROUBLESHOOTING IN VS CODE

### Problem: Extensions not working
**Solution:** 
- Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
- Restart VS Code

### Problem: Terminal command not found
**Solution:**
- Close and reopen VS Code
- Make sure Node.js is installed: `node --version`

### Problem: Can't see changes
**Solution:**
- Save the file (`Ctrl+S`)
- Check if dev server is running in terminal
- Hard refresh browser (`Ctrl+Shift+R`)

### Problem: Port already in use
**Solution:**
- Kill the process using Task Manager / Activity Monitor
- Or change port in `backend/.env`: `PORT=5001`

### Problem: MongoDB connection error
**Solution:**
- Check `backend/.env` has correct MongoDB URI
- Verify password has no special characters (or URL encode them)
- Check MongoDB Atlas network access settings

---

## 🔍 VS CODE KEYBOARD SHORTCUTS

### Essential Shortcuts:

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Open file | `Ctrl+P` | `Cmd+P` |
| Save file | `Ctrl+S` | `Cmd+S` |
| Toggle terminal | `` Ctrl+` `` | `` Cmd+` `` |
| Find in files | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Command palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Run task | `Ctrl+Shift+B` | `Cmd+Shift+B` |
| Debug | `F5` | `F5` |
| Format document | `Shift+Alt+F` | `Shift+Option+F` |

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything works:

- [ ] VS Code opened with jobshare-pro folder
- [ ] Recommended extensions installed
- [ ] Dependencies installed (`npm run install:all` completed)
- [ ] `.env` file created and configured in backend folder
- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Can create an account
- [ ] Can post a job (as employer)
- [ ] Can browse jobs

---

## 🎯 YOUR FIRST TASKS IN VS CODE

### Task 1: Explore the Code (10 minutes)

1. **Backend:** Open `backend/server.js`
   - See how the server starts
   - Find the routes being used

2. **Frontend:** Open `frontend/src/App.jsx`
   - See the React routing
   - Find the page components

3. **Styling:** Open `frontend/src/index.css`
   - See the color variables
   - Try changing one color!

### Task 2: Make Your First Change (5 minutes)

1. Open `frontend/src/pages/Home.jsx`
2. Find the heading text
3. Change it to something else
4. Save (`Ctrl+S`)
5. See the change in your browser!

### Task 3: Test the API (5 minutes)

1. Install **Thunder Client** extension
2. Create new request
3. GET http://localhost:5000/api/jobs
4. See the JSON response!

---

## 🎓 LEARNING RESOURCES

### In VS Code:
- Hover over any function/variable to see info
- Right-click → "Go to Definition" to see where it's defined
- Use breadcrumbs at top to navigate file structure

### Documentation:
- `README.md` - Full technical docs
- `START_HERE.md` - Beginner guide
- `DEPLOYMENT.md` - Deploy to production

---

## 🚀 NEXT STEPS

1. ✅ Get everything running
2. 📖 Explore the code
3. 🎨 Make small changes
4. 🔧 Add new features
5. 🌐 Deploy to internet!

---

## 💡 PRO TIPS

1. **Use Git Integration**
   - VS Code has built-in Git
   - Source Control icon in left sidebar
   - Commit your changes regularly!

2. **Use Snippets**
   - Type `rfce` in a .jsx file → React component
   - Type `log` → console.log()
   - Install React snippets extension for more!

3. **Split Editor**
   - `Ctrl+\` to split editor
   - View backend and frontend side-by-side!

4. **Zen Mode**
   - `Ctrl+K Z` for distraction-free coding
   - ESC ESC to exit

5. **Problems Panel**
   - `Ctrl+Shift+M` to see all errors
   - Fix errors as you code!

---

## 🎉 YOU'RE READY TO CODE!

VS Code is now set up perfectly for full-stack development!

**Start the app:**
```bash
npm run dev
```

**Then open:** http://localhost:5173

Happy coding! 🚀

---

## 📞 NEED HELP?

1. Press `F1` → Search for help
2. Check `START_HERE.md` for detailed guide
3. Google VS Code + your question
4. Check terminal for error messages

---

*Optimized for Visual Studio Code*
*Built with ❤️ for easy development*
