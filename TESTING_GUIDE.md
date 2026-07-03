# Quick Testing Guide for PIANOW App

## Getting Started

The app is fully functional and ready to test. Here are the quickest ways to experience it:

---

## Option 1: Test via Browser (Easiest)

### 1. Signup
1. Open the preview in the browser
2. Click "Create an account" or go to `/auth/signup`
3. Fill in:
   - Full Name: `John Smith`
   - Email: `john@test.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Check the terms checkbox
5. Click "Create Account"
6. You'll be redirected to login page

### 2. Login
1. Fill in the login form:
   - Email: `john@test.com`
   - Password: `password123`
2. Click "Sign in"
3. You'll be redirected to the home page with full access

### 3. Explore the App
Once logged in, you can:
- Click **Lessons** to browse music lessons
- Click **Shop** to view musical instruments and equipment
- Click **Teachers** to see instructor profiles
- Click **Live** to access live session features
- Click the **user icon** (top right) to access your profile
- Click the **bell icon** for notifications
- Use **Cmd+K** or **Ctrl+K** to open the search

---

## Option 2: Test via API (For Developers)

### Create User via API
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@test.com",
    "password": "testpass123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "user-id-here",
    "email": "jane@test.com",
    "name": "Jane Doe",
    "role": "user"
  },
  "token": "jwt-token-here",
  "session": { ... }
}
```

### Login via API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@test.com",
    "password": "testpass123"
  }'
```

### Verify Session
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Test Accounts (Pre-created)

If you want to test without creating an account:

**Email:** `test@test.com`  
**Password:** `test123`

---

## Page Tour

### Home Page (`/`)
- Hero section with call-to-action buttons
- Featured teachers and products
- Statistics showing community size

### Lessons Page (`/lessons`)
- Browse 500+ music lessons
- Filter by difficulty level
- Filter by instrument type
- Search for specific lessons

### Shop Page (`/shop`)
- Browse 50+ musical instruments
- Filter by price, brand, category
- View product details
- Add to cart functionality

### Teachers Page (`/teachers`)
- Find expert instructors
- View teacher profiles and specialties
- Book lessons
- Upload videos

### Live Page (`/live`)
- Start your own live stream
- Set stream title
- Live session features

### Profile Page (`/account/profile`)
- View personal information
- See learning history
- Check purchase records
- Update account settings

---

## Common Actions

### Search (Global)
- Press **Cmd+K** (Mac) or **Ctrl+K** (Windows/Linux)
- Type lesson name, instrument, or topic
- Select result to navigate

### Change Theme
- Click the **sun/moon icon** in the top right
- Toggles between light and dark mode

### View Notifications
- Click the **bell icon** (top right)
- Shows unread notifications

### View Cart
- Click the **shopping cart icon** (top right)
- Shows items in your cart

### Access Account Menu
- Click the **user icon** (top right)
- Options:
  - View profile
  - My Progress (learning tracker)
  - Edit Profile
  - Sign Out

### Logout
1. Click the **user icon** (top right)
2. Click "Sign Out"
3. You'll be logged out and redirected to home

---

## Features to Explore

### 1. Authentication
- Sign up with email/password
- Log in with credentials
- Session persists across page reloads
- Secure JWT token validation

### 2. Navigation
- Full header with responsive menu
- Quick navigation between sections
- Breadcrumb navigation on detail pages
- Back buttons to return to lists

### 3. Filtering & Search
- Search lessons by title, instructor, topic
- Filter products by price, brand, category
- Filter lessons by difficulty and instrument
- Sort products by featured, price, rating

### 4. User Profile
- View personal information
- See learning statistics
- Check purchase history
- Update account settings

### 5. Product Browsing
- View instrument details
- Check prices and availability
- Add to cart
- View related products

### 6. Lesson Content
- Browse lesson library
- View lesson details
- See instructor info
- Duration and difficulty level
- Video playback (placeholder)

---

## Testing Checklist

Use this to verify everything works:

- [ ] Can sign up with new account
- [ ] Can log in with email/password
- [ ] Home page loads after login
- [ ] Can navigate to Lessons page
- [ ] Can search lessons
- [ ] Can filter lessons by level
- [ ] Can navigate to Shop page
- [ ] Can filter products
- [ ] Can navigate to Teachers page
- [ ] Can view teacher profiles
- [ ] Can access Live page
- [ ] Can open user profile
- [ ] Can change theme (dark/light)
- [ ] Can open search (Cmd+K)
- [ ] Can view notifications
- [ ] Can view cart
- [ ] Can logout
- [ ] Cannot access protected pages when logged out

---

## Troubleshooting

### Login Not Working?
1. Check email is spelled correctly
2. Verify password is entered correctly
3. Ensure you've signed up first
4. Check browser console for error messages
5. Clear localStorage and try again

### Pages Not Loading?
1. Ensure you're logged in (check user icon)
2. Try refreshing the page (F5 or Cmd+R)
3. Check network tab in developer tools
4. Verify API endpoints are responding

### Theme Not Changing?
1. Click the theme toggle button again
2. Refresh the page
3. Check if browser has dark mode enabled

### Can't Logout?
1. Click user icon → Sign Out
2. Refresh the page
3. Try accessing a protected page - should redirect to login

---

## Developer Notes

### Authentication Flow
1. User enters credentials
2. API validates and returns JWT token
3. Token stored in localStorage
4. Token sent with every request in `Authorization` header
5. `/auth/me` endpoint validates token and returns user

### Protected Routes
- AuthGuard component checks if user is authenticated
- If not authenticated, redirects to `/auth/login`
- Loading state shown while checking auth status

### API Response Format
```json
{
  "success": true,
  "user": { ... },
  "token": "jwt-token",
  "error": null
}
```

### Environment Variables
- `NEXT_PUBLIC_API_URL` - API base URL (default: `/api`)
- Auth tokens stored in `pianow_user` and `pianow_token` localStorage keys

---

## Support

If you encounter any issues:

1. **Check the console** - Look for error messages with `[v0]` prefix
2. **Check network tab** - Verify API responses
3. **Check localStorage** - See if tokens are being stored
4. **Review logs** - Check browser and server logs for details

---

**Happy Testing! 🎵**

For more information, see `APP_EXPERIENCE_TEST.md` for the full test report.
