# 🌐 DEPLOYMENT GUIDE - JobShare Pro

Complete guide to deploying your job board platform to the internet.

## 📋 Pre-Deployment Checklist

- [ ] Test application locally
- [ ] Set up MongoDB Atlas account (free tier)
- [ ] Change JWT_SECRET to a secure random string
- [ ] Update CORS settings for production
- [ ] Test all features before deploying

---

## 🗄️ Step 1: Deploy Database (MongoDB Atlas)

### Create MongoDB Atlas Cluster (FREE)

1. **Sign Up**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account

2. **Create Cluster**
   - Click "Build a Database"
   - Select "FREE" M0 tier
   - Choose cloud provider and region (closest to you)
   - Name your cluster (e.g., "jobshare-cluster")
   - Click "Create"

3. **Configure Network Access**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for now)
   - Click "Confirm"

4. **Create Database User**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (SAVE THESE!)
   - Set "Built-in Role" to "Atlas admin"
   - Click "Add User"

5. **Get Connection String**
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Save this connection string for later!

Example: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/jobshare`

---

## 🖥️ Step 2: Deploy Backend API

### Option A: Heroku (Recommended)

#### Install Heroku CLI
```bash
# Mac
brew install heroku/brew/heroku

# Windows (download from)
# https://devcenter.heroku.com/articles/heroku-cli
```

#### Deploy Steps
```bash
# 1. Login to Heroku
heroku login

# 2. Navigate to backend folder
cd backend

# 3. Create Heroku app
heroku create jobshare-api-yourname

# 4. Set environment variables
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_secure_random_string"
heroku config:set NODE_ENV=production

# 5. Initialize git (if not done)
git init

# 6. Add Heroku remote
heroku git:remote -a jobshare-api-yourname

# 7. Commit and deploy
git add .
git commit -m "Deploy backend"
git push heroku main

# 8. Check logs
heroku logs --tail
```

Your backend URL: `https://jobshare-api-yourname.herokuapp.com`

### Option B: Railway (Alternative)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your repository
6. Select the `backend` folder
7. Add environment variables in Railway dashboard
8. Deploy!

### Option C: Render

1. Go to https://render.com
2. Sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub/GitLab
5. Select repository and `backend` folder
6. Add environment variables
7. Deploy!

---

## 🎨 Step 3: Deploy Frontend

### Option A: Vercel (Recommended for React)

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy Steps
```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Update API URL
# Edit src/utils/api.js
# Change baseURL to your deployed backend URL:
const api = axios.create({
  baseURL: 'https://jobshare-api-yourname.herokuapp.com/api'
});

# 3. Build the project
npm run build

# 4. Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? jobshare-frontend
# - In which directory is your code located? ./
# - Want to override settings? N

# 5. Get production URL
vercel --prod
```

Your frontend URL: `https://jobshare-frontend.vercel.app`

### Option B: Netlify

1. **Via CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Update API URL in src/utils/api.js

# Build
npm run build

# Deploy
netlify deploy --prod

# Follow prompts and select dist folder
```

2. **Via Dashboard**
   - Go to https://netlify.com
   - Click "Add new site" → "Deploy manually"
   - Drag and drop your `frontend/dist` folder
   - Done!

### Option C: GitHub Pages

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# 3. Update vite.config.js
export default defineConfig({
  base: '/jobshare-pro/',  // your repo name
  // ... rest of config
})

# 4. Deploy
npm run deploy
```

URL: `https://yourusername.github.io/jobshare-pro/`

---

## ⚙️ Step 4: Configure Production Settings

### Update Backend CORS

In `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true
}));
```

### Update Frontend API URL

In `frontend/src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-url.herokuapp.com/api'
});
```

### Environment Variables Summary

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jobshare
JWT_SECRET=your_secure_random_32_character_string
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=5000
```

**Frontend:**
- Update `baseURL` in `src/utils/api.js`

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Use HTTPS for all connections
- [ ] Update CORS to specific frontend URL
- [ ] Keep MongoDB connection string private
- [ ] Set up MongoDB IP whitelist
- [ ] Enable rate limiting (already included)
- [ ] Regular security updates

---

## 🧪 Testing Your Deployment

1. **Test Backend**
```bash
curl https://your-backend-url.herokuapp.com/api/health
# Should return: {"status":"OK","message":"JobShare API is running"}
```

2. **Test Frontend**
   - Open your frontend URL
   - Try registering a new account
   - Post a job (as employer)
   - Browse and search jobs
   - Test all features

---

## 📊 Monitoring

### Heroku
```bash
# View logs
heroku logs --tail -a jobshare-api-yourname

# Check app status
heroku ps -a jobshare-api-yourname
```

### MongoDB Atlas
- Dashboard → Metrics
- View connections, operations, storage

### Vercel
- Dashboard → Your Project → Analytics
- View deployments and logs

---

## 🔄 Updating Your Deployment

### Backend Updates
```bash
cd backend
git add .
git commit -m "Update: description"
git push heroku main
```

### Frontend Updates
```bash
cd frontend
npm run build
vercel --prod
```

---

## 💰 Cost Breakdown

All services have FREE tiers sufficient for learning/portfolio:

| Service | Free Tier | Limits |
|---------|-----------|--------|
| MongoDB Atlas | M0 | 512 MB storage |
| Heroku | Free dynos* | Sleep after 30 min inactivity |
| Vercel | Hobby | 100 GB bandwidth/month |
| Netlify | Starter | 100 GB bandwidth/month |
| Railway | $5 credit/month | Good for small projects |

*Note: Heroku removed free tier in Nov 2022. Use Railway or Render instead.

---

## 🆘 Troubleshooting

### Database Connection Error
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Test connection string locally first

### CORS Error
- Verify frontend URL in backend CORS config
- Check backend URL in frontend API config

### 404 Errors on Frontend Routes
- Add `_redirects` file to frontend/public:
```
/*    /index.html   200
```

### Environment Variables Not Working
- Restart app after setting variables
- Check variable names match exactly
- Don't use quotes in Heroku config vars

---

## 🎉 Success!

Your JobShare Pro platform is now live on the internet!

Share your links:
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-api.herokuapp.com
- **GitHub**: https://github.com/yourusername/jobshare-pro

Add to your portfolio, resume, and LinkedIn! 🚀

---

## 📚 Additional Resources

- [Heroku Deployment Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---

**Need Help?** Check the main README.md or create an issue on GitHub!
