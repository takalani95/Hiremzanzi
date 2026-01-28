# 🚀 QUICK START GUIDE - JobShare Pro

## Get Running in 5 Minutes!

### Step 1: Install Dependencies (2 minutes)
```bash
cd jobshare-pro
npm run install:all
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB (Recommended for Beginners)**
1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. It will run on `mongodb://localhost:27017` by default

**Option B: MongoDB Atlas (Cloud - FREE)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 - Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Step 3: Configure Environment Variables (1 minute)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set:
```env
MONGODB_URI=mongodb://localhost:27017/jobshare
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobshare

JWT_SECRET=my_super_secret_key_change_in_production
PORT=5000
```

### Step 4: Start the Application (30 seconds)
```bash
# From the root directory (jobshare-pro/)
npm run dev
```

This starts BOTH backend and frontend:
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Step 5: Use the Application! 🎉

Open your browser to http://localhost:5173

#### Create Your First Account:
1. Click "Sign Up"
2. Fill in your details
3. Choose "Employer" if you want to post jobs
4. Choose "Job Seeker" if you want to apply for jobs

#### Post Your First Job (as Employer):
1. After logging in, click "Post Job"
2. Fill in job details
3. Click "Post Job"
4. View it on the Browse Jobs page!

#### Apply for Jobs (as Job Seeker):
1. Go to "Browse Jobs"
2. Click on any job card
3. Click "Apply for this Position"

## 🎯 What You Just Built

You now have a **PRODUCTION-READY** job board with:
- ✅ User authentication (Login/Register)
- ✅ Role-based access (Employers can post, Job Seekers can apply)
- ✅ Real database (MongoDB)
- ✅ RESTful API (Backend)
- ✅ Modern React frontend
- ✅ Search and filtering
- ✅ Responsive design

## 🌐 Ready to Deploy?

See the main README.md for deployment instructions to:
- **Backend**: Heroku, Railway, Render
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas (FREE)

## 🐛 Having Issues?

### MongoDB not connecting?
- Make sure MongoDB is running: `mongod` command
- Or use MongoDB Atlas (cloud) instead

### Port already in use?
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (5173): Vite will auto-increment port

### Can't login after registering?
- Check browser console (F12)
- Make sure MongoDB is running
- Verify `JWT_SECRET` is set in backend/.env

## 📝 Test Users

Create accounts with different roles:

**Employer Account:**
- Name: Tech Company HR
- Email: employer@test.com
- Password: password123
- Role: Employer
- Company: Tech Innovations Inc.

**Job Seeker Account:**
- Name: John Developer
- Email: jobseeker@test.com
- Password: password123
- Role: Job Seeker

## 🎓 Next Steps

1. **Explore the code** - Start with `backend/server.js` and `frontend/src/App.jsx`
2. **Customize the design** - Edit `frontend/src/index.css`
3. **Add features** - See "Future Enhancements" in README.md
4. **Deploy to production** - Follow deployment guide in README.md

## 💡 Pro Tips

- Use **Postman** to test API endpoints
- Use **MongoDB Compass** to view your database
- Use **React DevTools** browser extension
- Check **browser console** (F12) for errors

---

Congratulations! You're now running a professional full-stack application! 🎉

For detailed documentation, see README.md
