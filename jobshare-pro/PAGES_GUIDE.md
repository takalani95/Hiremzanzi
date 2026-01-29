# Dynamic Pages & Navigation System

## ✅ What's New

You can now create, edit, and manage unlimited navigation pages/tabs directly from the admin interface!

## 🎯 Features

### For Admins:
- **Manage Pages**: Access `/page-management` to create, edit, and delete pages
- **Dynamic Navigation**: Pages automatically appear in the navbar once created
- **Organized Content**: Set display order to control page sequence in navbar
- **HTML Support**: Use HTML in page content for rich formatting

### For Visitors:
- **Dynamic Tabs**: View all pages as navigation tabs
- **Easy Navigation**: Click any tab to view its content
- **Slugified URLs**: Pages are accessible by friendly URLs like `/pages/news`, `/pages/career-advice`, etc.

## 🚀 Getting Started

### 1. Initialize Sample Pages (First Time)

Run the setup script to create default pages:

```bash
cd backend
node setup-pages.js
```

This creates 12 sample pages:
- Home
- News
- Work Opportunities
- Jobs
- Funding
- Studying
- Career Advice
- Youtube
- NSFAS
- SASSA
- UNISA
- FAQ

### 2. Access Page Management

1. Login as an admin
2. Click **"Manage Pages"** in the navbar
3. You'll see all existing pages with options to Edit or Delete

### 3. Create a New Page

**From the admin page:**
1. Click **"+ Add New Page"**
2. Fill in:
   - **Title**: Page name (e.g., "Internships")
   - **Description**: Short description
   - **Content**: Page content (can include HTML)
   - **Order**: Display order in navbar (0 = first)
3. Click **"Create Page"**

**Via API:**

```bash
curl -X POST http://localhost:5000/api/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Internships",
    "description": "Internship programs",
    "content": "<h2>Internship Programs</h2><p>Join our internship programs...</p>",
    "order": 5
  }'
```

### 4. Edit an Existing Page

1. From **"Manage Pages"**, click **Edit** on any page
2. Update title, description, content, or order
3. Click **"Update Page"**

### 5. Delete a Page

1. From **"Manage Pages"**, click **Delete** on the page
2. Confirm deletion
3. Page is permanently removed

### 6. Visit a Page

Once a page is created:
- It automatically appears in the navbar (sorted by order)
- Click the page title in navbar to view it
- Or navigate directly to `/pages/page-slug`

Examples:
- `/pages/news`
- `/pages/career-advice`
- `/pages/funding`

## 🔧 Technical Details

### Database Model (Page)

```javascript
{
  title: String (required, unique),
  slug: String (auto-generated from title),
  description: String,
  content: String (supports HTML),
  order: Number (default: 0),
  isActive: Boolean (default: true)
}
```

### API Endpoints

**Get all active pages:**
```
GET /api/pages
```

**Get single page by slug:**
```
GET /api/pages/:slug
```

**Create page (admin only):**
```
POST /api/pages
Headers: Authorization: Bearer TOKEN
Body: { title, description, content, order }
```

**Update page (admin only):**
```
PUT /api/pages/:id
Headers: Authorization: Bearer TOKEN
Body: { title, description, content, order }
```

**Delete page (admin only):**
```
DELETE /api/pages/:id
Headers: Authorization: Bearer TOKEN
```

## 📝 Content Tips

### Using HTML in Content

You can use HTML tags for rich formatting:

```html
<h2>Section Title</h2>
<p>Regular paragraph text.</p>
<ul>
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>
<strong>Bold text</strong> and <em>italic text</em>
```

### Example Content for Different Pages

**News Page:**
```html
<h2>Latest News</h2>
<p><strong>January 2024</strong></p>
<p>We've launched new features to help job seekers find opportunities...</p>
<p><strong>December 2023</strong></p>
<p>100,000 users joined our platform...</p>
```

**FAQ Page:**
```html
<h2>Frequently Asked Questions</h2>
<h3>How do I apply for jobs?</h3>
<p>Sign up, browse jobs, and click apply with your CV attached.</p>
<h3>Is there a fee?</h3>
<p>No, Hire Mzansi is completely free for job seekers.</p>
```

**Career Advice Page:**
```html
<h2>Resume Writing Tips</h2>
<ol>
  <li>Keep it concise (1-2 pages)</li>
  <li>Use clear formatting</li>
  <li>Highlight key achievements</li>
  <li>Tailor to job description</li>
</ol>
```

## 🔐 Security

- Only **admin users** can create, edit, or delete pages
- All pages are **publicly viewable**
- JWT authentication required for admin operations
- Page slugs cannot be duplicated

## 📊 Common Tasks

### Reorder Pages in Navbar

Edit each page and change the `order` field:
- Smaller numbers appear first
- Pages with same order sort alphabetically by title

### Disable a Page Temporarily

API only: Set `isActive: false` on the page (UI coming soon)

### Reset All Pages to Defaults

```bash
# Delete all pages
cd backend
node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobshare').then(() => require('./models/Page').deleteMany({}).then(() => process.exit(0)))"

# Recreate defaults
node setup-pages.js
```

### View All Pages in Database

```bash
cd backend
node -e "require('mongoose').connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobshare').then(async () => { const pages = await require('./models/Page').find(); console.table(pages); process.exit(0); })"
```

## 🐛 Troubleshooting

**Pages don't appear in navbar:**
- Make sure you've created at least one page
- Check browser console for errors
- Refresh the page

**Can't create page with existing title:**
- Page titles must be unique
- Try "News Page" instead of "News" if "News" already exists

**Slug looks weird:**
- Slugs are auto-generated from titles
- Special characters are removed
- Spaces become hyphens

**Content not displaying:**
- Check for HTML syntax errors
- Avoid using `<script>` tags (security)
- Test in a text editor first

## 📚 Next Steps

1. **Create Sample Pages**: Run `node setup-pages.js` to initialize defaults
2. **Customize Pages**: Edit each page with your content
3. **Test Navigation**: Click pages in navbar to verify they work
4. **Add More Pages**: Create additional pages as needed

Enjoy managing your dynamic pages! 🎉
