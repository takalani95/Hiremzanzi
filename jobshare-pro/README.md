# 🚀 JobShare Pro - Advanced Full-Stack Job Board Platform

A professional, production-ready job sharing platform built with **Node.js, Express, MongoDB, React, and Vite**. This application features user authentication, job posting, search & filtering, and a modern, responsive UI.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login (JWT-based)
- Role-based access control (Job Seekers, Employers, Admin)
- Protected routes and API endpoints
- Secure password hashing with bcrypt

### 💼 Job Management
- Browse all jobs with advanced filtering
- Search by title, company, location, or description
- Filter by job type, category, and experience level
- Detailed job view pages
- Post new jobs (Employers only)
- Edit and delete your own job postings

### 👤 User Features
- User dashboard
- Save/bookmark favorite jobs
- Track applied jobs
- Profile management
- View application status

### 🎨 Modern UI/UX
- Distinctive, professional design
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Custom color palette and typography
- Loading states and error handling

## 📁 Project Structure

```
jobshare-pro/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB models (User, Job)
│   ├── routes/             # API routes (auth, jobs, users)
│   ├── middleware/         # Authentication middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # State management (Zustand)
│   │   ├── utils/          # API utilities
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   └── package.json        # Frontend dependencies
└── package.json            # Root scripts

```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **CSS Variables** - Theming

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Installation

#### 1. Clone or Download the Project
```bash
cd jobshare-pro
```

#### 2. Install All Dependencies
```bash
npm run install:all
```

This command installs dependencies for root, backend, and frontend.

#### 3. Set Up Environment Variables

**Backend (.env file):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/jobshare
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**For MongoDB Atlas (Cloud Database):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and replace in `MONGODB_URI`
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobshare
```

#### 4. Run the Application

**Option A: Run Both (Recommended for Development)**
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/update-profile` - Update profile (Protected)

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Employer only)
- `PUT /api/jobs/:id` - Update job (Owner/Admin)
- `DELETE /api/jobs/:id` - Delete job (Owner/Admin)
- `POST /api/jobs/:id/apply` - Apply to job (Protected)
- `POST /api/jobs/:id/save` - Save/bookmark job (Protected)
- `GET /api/jobs/my/posted` - Get my posted jobs (Employer)

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/me/saved-jobs` - Get saved jobs (Protected)
- `GET /api/users/me/applied-jobs` - Get applied jobs (Protected)

## 🎨 Design Features

### Color Palette
- **Primary**: Warm sunset orange (#FF6B35)
- **Secondary**: Deep ocean blue (#004E89)
- **Accent**: Bright yellow (#FFD23F)
- **Success**: Teal green (#06D6A0)

### Typography
- **Display**: Playfair Display (Serif) - For headings
- **Body**: DM Sans (Sans-serif) - For content

### Key Design Elements
- Distinctive gradient backgrounds
- Smooth hover animations
- Card-based layouts
- Rounded corners with consistent radius
- Professional shadows
- Responsive grid system

## 🌐 Deployment

### Deploy Backend (Heroku Example)

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create jobshare-api
```

4. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production
```

5. **Deploy**
```bash
git init
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Deploy Frontend (Vercel Example)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build Frontend**
```bash
cd frontend
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Update API URL**
After deployment, update the frontend to point to your deployed backend:
```javascript
// frontend/src/utils/api.js
const api = axios.create({
  baseURL: 'https://your-backend-url.herokuapp.com/api'
});
```

### Other Deployment Options

**Backend:**
- Railway (https://railway.app)
- Render (https://render.com)
- DigitalOcean App Platform
- AWS Elastic Beanstalk

**Frontend:**
- Netlify (https://netlify.com)
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting

**Database:**
- MongoDB Atlas (Recommended - Free tier available)
- Railway (Includes MongoDB)

## 🔒 Security Best Practices

1. **Change JWT Secret**
   - Generate a strong random string for `JWT_SECRET`
   - Use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Environment Variables**
   - Never commit `.env` files
   - Use different secrets for development and production

3. **CORS Configuration**
   - Update `FRONTEND_URL` in production
   - Restrict to your actual frontend domain

4. **Rate Limiting**
   - Already implemented (100 requests per 15 minutes)
   - Adjust in `server.js` if needed

5. **Input Validation**
   - All routes use express-validator
   - Add more validation as needed

## 📱 User Guide

### For Job Seekers
1. **Register** - Create account with "Job Seeker" role
2. **Browse Jobs** - Use filters to find relevant positions
3. **Save Jobs** - Bookmark interesting positions
4. **Apply** - Submit applications to jobs
5. **Track** - View your applied jobs in dashboard

### For Employers
1. **Register** - Create account with "Employer" role
2. **Post Jobs** - Create new job listings
3. **Manage** - Edit or delete your postings
4. **Review** - See applications (feature in development)

## 🔧 Customization

### Change Color Scheme
Edit `frontend/src/index.css`:
```css
:root {
  --primary: #FF6B35;        /* Change to your color */
  --secondary: #004E89;      /* Change to your color */
  --accent: #FFD23F;         /* Change to your color */
}
```

### Add New Fields to Jobs
1. Update `backend/models/Job.js`
2. Update `backend/routes/jobs.js` validation
3. Update frontend forms in `frontend/src/pages/PostJob.jsx`
4. Update job cards display

### Add Email Notifications
1. Install nodemailer: `npm install nodemailer`
2. Create email service in `backend/utils/email.js`
3. Call email service after job application, registration, etc.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally, or
- Check MongoDB Atlas connection string
- Verify network access in Atlas

### Port Already in Use
```bash
# Kill process on port 5000 or 5173
# Linux/Mac:
lsof -ti:5000 | xargs kill -9
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend is running on correct port

### Authentication Not Working
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token is being sent in headers

## 📚 Learning Resources

- **Node.js**: https://nodejs.org/docs
- **Express**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Resume upload functionality
- [ ] Advanced search with location radius
- [ ] Job recommendations based on skills
- [ ] Messaging between employers and candidates
- [ ] Company profiles
- [ ] Job alerts/subscriptions
- [ ] Analytics dashboard for employers
- [ ] PDF resume generation
- [ ] Social media integration

## 💡 Tips

- Test with sample data first
- Use MongoDB Compass to view database
- Use Postman/Insomnia to test API
- Check browser console for errors
- Use React DevTools for debugging

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🙏 Support

If you encounter issues:
1. Check console errors (F12 in browser)
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check environment variables are set

---

**Built with ❤️ for learning full-stack web development**

Happy Coding! 🚀
