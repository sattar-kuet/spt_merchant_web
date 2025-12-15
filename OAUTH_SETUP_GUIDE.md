# OAuth2 Google Sheets Setup Guide

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable required APIs:
   - Google Sheets API
   - Google Drive API

## Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services > Credentials**
2. Click **"+ CREATE CREDENTIALS" > "OAuth 2.0 Client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: SPT Merchant Web
   - Add your email as support email
   - Add authorized domains if deploying to production
4. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: SPT Merchant OAuth Client
   -  **Authorized redirect URIs** - Add:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Click **CREATE**
6. Copy the **Client ID** and **Client Secret**

## Step 3: Update Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret

# Generate NEXTAUTH_SECRET using:
# openssl rand -base64 32
```

## Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 5: Test Authentication

1. Navigate to bulk parcel page
2. Click "Sign in with Google"
3. Authorize the app
4. Create a new Google Sheet
5. Verify sheet has template headers

## Troubleshooting

### "Access blocked: App has not completed the Google verification process"
**Cause:** Your app is in "Testing" mode and your email is not added as a tester.
**Fix:**
1. Go to **APIs & Services > OAuth consent screen**
2. Scroll to **Test users**
3. Click **+ ADD USERS**
4. Add your email address (`fahmidurshanto@gmail.com`)
5. Click **Save**

### "redirect_uri_mismatch" error
- Check that redirect URI in Google Cloud Console matches exactly
- Include `/api/auth/callback/google` path

### "invalid_client" error  
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check for extra spaces or quotes in .env.local

### Sheet creation fails
- Verify user is signed in
- Check browser console for errors
- Ensure APIs are enabled in Google Cloud Console
