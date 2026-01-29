# MongoDB Setup Guide for JobShare Pro

## Option 1: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Create a free account" or sign in
3. Create a new cluster (M0 free tier)
4. Create a database user with username and password
5. Get the connection string
6. Update your .env file with the connection string:

MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jobshare?retryWrites=true&w=majority

7. Replace:
   - username: Your MongoDB Atlas username
   - password: Your MongoDB Atlas password
   - cluster0.xxxxx: Your cluster name (from Atlas dashboard)

## Option 2: Install MongoDB Community Server Locally (Windows)

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will install as a Windows service
4. Start MongoDB service:
   - Open Services (services.msc)
   - Find "MongoDB Server"
   - Start it

5. Your .env should have:
MONGODB_URI=mongodb://localhost:27017/jobshare

## Option 3: Use MongoDB in Docker (If you have Docker installed)

docker run -d -p 27017:27017 --name mongodb mongo:latest

Then update .env:
MONGODB_URI=mongodb://localhost:27017/jobshare

## Quick Test

After setting up MongoDB, run:
node setup-admin-and-job.js

This will:
- Create an admin account (admin@jobshare.com / Admin@123456)
- Post the Junior Data Processer job
