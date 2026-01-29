# CV Upload & Management System - Like Indeed

## Overview
Your JobShare application now supports CV uploads for job applications, just like Indeed does. Applicants can upload their resumes when applying for jobs, and employers can download them from the applications dashboard.

## How It Works

### 1. **Applicant Side - Submitting an Application with CV**
- Navigate to a job listing and click "Apply for this Position"
- Upload your CV (PDF, DOC, or DOCX format)
- CV size must be less than 5MB
- Click "Submit Application"
- You'll receive a confirmation email with your application details

### 2. **Employer/Admin Side - Reviewing Applications with CVs**
- Go to **Manage Applications** (visible only to admin users)
- View all applications in a card-based layout
- Click on any application card to open the detailed view
- Download the applicant's CV directly from the detail modal
- Update application status and add internal notes
- Status changes trigger automatic email notifications to applicants

## Technical Implementation

### Database Schema
**Application Model** includes:
- `resumeUrl` - Filename of uploaded CV (stored in `/backend/uploads/`)
- `coverLetter` - Optional cover letter text
- `status` - Application status (pending, reviewed, accepted, rejected)
- `notes` - Internal notes for recruiters
- `appliedAt` - Timestamp when application was submitted

### File Storage
CVs are stored in:
```
backend/uploads/cv_[userId]_[timestamp]_[filename]
```
- Pattern prevents filename conflicts
- Only allowed formats: PDF, DOC, DOCX
- Max file size: 5MB
- Files are automatically deleted when application is deleted

### API Endpoints

#### 1. Submit Application with CV
```
POST /api/applications
Authorization: Bearer [token]
Content-Type: multipart/form-data

Body:
- jobId: [job ID]
- cv: [file] (required)
```
**Response:** Application created with resumeUrl

#### 2. Get All Applications (Admin)
```
GET /api/applications
Authorization: Bearer [token]
```
**Returns:** All applications with CV info (admin only)

#### 3. Download Application CV
```
GET /api/applications/[appId]/cv
Authorization: Bearer [token]
```
**Returns:** CV file for download
- Only application owner or admin can access
- Returns 404 if CV doesn't exist

#### 4. Update Application Status
```
PUT /api/applications/[appId]
Authorization: Bearer [token]
Content-Type: application/json

Body:
{
  "status": "accepted",
  "notes": "Great fit for the role"
}
```
**Note:** Emails are automatically sent to applicants on status changes

#### 5. Delete Application (Deletes CV too)
```
DELETE /api/applications/[appId]
Authorization: Bearer [token]
```
**Note:** Associated CV file is automatically deleted from server

### Frontend Components

#### JobDetails.jsx
- Application form with CV file upload input
- File validation (type & size)
- Shows selected filename
- Error handling for failed uploads

#### ApplicationsManagement.jsx
- Card layout showing all applications
- CV download link on each application card
- Detail modal with:
  - Full applicant information
  - CV download button
  - Cover letter view
  - Status update controls
  - Internal notes editor

### Middleware & Security
- **Protect Middleware:** All routes require JWT authentication
- **IsAdmin Middleware:** Some routes restricted to admin users
- **Authorization:** Users can only download their own CVs or their applications (admins see all)
- **File Validation:** Size and type checking before upload

## Usage Flow

### Step 1: Applicant Uploads CV
```
1. Browse job listings
2. Click on a job to view details
3. Click "Apply for this Position"
4. Upload CV (PDF, DOC, or DOCX)
5. Click "Submit Application"
6. Receive confirmation email
```

### Step 2: Admin Reviews and Downloads CV
```
1. Log in as admin
2. Click "Manage Applications" tab
3. Filter by status if needed
4. Click on an application card
5. Click "📥 Download CV" button
6. Save CV to computer
```

### Step 3: Admin Updates Application Status
```
1. Open application detail
2. Add internal notes (optional)
3. Click status button (Mark as Reviewed, Accepted, or Rejected)
4. Applicant receives status update email
```

## Features

✅ **File Type Validation**
- Only PDF, DOC, DOCX allowed
- Error message for invalid types

✅ **File Size Validation**
- Maximum 5MB per CV
- Clear error if file too large

✅ **Automatic File Cleanup**
- CVs deleted when applications deleted
- No orphaned files on server

✅ **Email Notifications**
- Applicant gets confirmation when submitting
- Applicant gets status updates
- Admin gets notification of new application

✅ **Access Control**
- Users can only access their own applications
- Admins can access all applications
- CV download restricted to authorized users

✅ **User-Friendly Download**
- Direct download from browser
- Filename preserved
- No API key or special handling needed

## Testing the Feature

### Test CV Upload
1. Register a new account (or use existing)
2. Find a job listing
3. Click "Apply for this Position"
4. Upload a test PDF file
5. Submit application
6. Confirm email received

### Test CV Download
1. Log in as admin (default: admin@jobshare.com / admin123)
2. Go to "Manage Applications"
3. Click on an application with CV uploaded
4. Click "📥 Download CV" button
5. Verify CV downloads correctly

### Test File Validation
1. Try uploading a non-PDF file (.txt, .jpg) - should show error
2. Try uploading file larger than 5MB - should show error
3. Try uploading valid CV - should succeed

## File Structure
```
backend/
├── uploads/                    # CV storage directory
│   ├── cv_[userId]_[timestamp]_resume.pdf
│   ├── cv_[userId]_[timestamp]_cv.docx
│   └── ...
├── routes/
│   └── applications.js         # Includes /api/applications/:id/cv endpoint
├── models/
│   └── Application.js          # Schema with resumeUrl field
└── server.js                   # Configured with file upload middleware

frontend/
├── src/pages/
│   ├── JobDetails.jsx          # CV upload form
│   └── ApplicationsManagement.jsx  # CV download & review
└── ...
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CV not uploading | Check file size < 5MB, format is PDF/DOC/DOCX |
| CV download fails | Verify admin has permission, CV file still exists on server |
| File already exists error | System auto-generates unique filenames, shouldn't occur |
| Email not received | Check spam folder, verify email service configured |

## Future Enhancements

Potential improvements for next versions:
- CV preview in browser (for PDF)
- Multiple CV upload option
- CV version history tracking
- Bulk download CVs for multiple applications
- CV parsing to extract skills
- Resume quality scoring
- Integration with Applicant Tracking Systems (ATS)

## Security Notes

- CVs stored in `/uploads` directory with restricted access
- Only authenticated users can access CVs
- File paths validated to prevent directory traversal attacks
- File extension whitelist (PDF, DOC, DOCX only)
- Filenames sanitized with timestamps to prevent conflicts
