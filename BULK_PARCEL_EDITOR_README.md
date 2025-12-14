# Bulk Parcel Editor - Google Sheets Integration

## Overview

This document describes the Google Sheets integration for the bulk parcel editor feature. We have successfully replaced the Handsontable spreadsheet editor with an embedded Google Sheets iframe to provide a full Google Sheets experience without requiring users to authenticate through the application.

## Implementation Details

### Completed Implementation

1. **Replaced Handsontable with Google Sheets iframe**
   - Embedded the Google Sheets directly in the page using iframe
   - Removed the Handsontable implementation and dependencies
   - Maintained the existing UI/UX design around the editor

2. **Provided Full Google Sheets Experience**
   - Users can edit the sheet directly in the browser
   - No authentication required for editing
   - Full Google Sheets UI and functionality available

3. **Implemented Backend Data Reading**
   - Created server-side API routes for reading Google Sheets data
   - Implemented sheet clearing functionality after submission
   - Preserved the toggle between upload and editor views

4. **Dynamic Sheet Creation Per User**
   - Each user gets their own Google Sheet when they navigate to the editor
   - Sheets are created with descriptive names including user ID and timestamp
   - Headers are automatically added to new sheets for consistency
   - Sheets are automatically shared with the service account for API access

## Current Workflow

1. Users navigate to the bulk parcel editor page
2. They can toggle between file upload and Google Sheets editor views
3. When switching to the editor view, a new Google Sheet is automatically created for them
4. Users can directly edit their personalized Google Sheet
5. Users click "Add Parcels" to submit their data
6. The application reads data from the Google Sheet via API
7. After successful submission, the sheet is automatically cleared (except headers)

## Technical Changes

### Files Created

1. `src/lib/googleSheets.ts` - Client-side utility functions for Google Sheets API integration
2. `src/hooks/useGoogleSheets.ts` - Custom React hook for Google Sheets operations
3. `src/app/api/google-sheets/read/route.ts` - API route for reading Google Sheets data
4. `src/app/api/google-sheets/clear/route.ts` - API route for clearing Google Sheets data
5. `src/app/api/google-sheets/create/route.ts` - API route for creating new Google Sheets

### Files Modified

1. `src/app/(main)/parcels/add-parcel/bulk-parcel/page.tsx` - Main page component with Google Sheets iframe integration
2. `package.json` - Updated dependencies

### Dependencies Added

- `googleapis` - Official Google APIs client library for Node.js

### Dependencies Removed

- `@handsontable/react` - Handsontable React component
- `handsontable` - Handsontable library and CSS
- `google-auth-library` - Google Authentication Library (no longer needed)

## Environment Variables

To fully configure the Google Sheets integration, add the following to your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://spt.itscholarbd.com/api/v1
NEXT_PUBLIC_GOOGLE_SHEET_ID=1FnM5enepgMx13vBp3fyG7m8397UZSZOLWFcR_b0BOfU
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

## Google Cloud Project Setup

To enable full functionality, you need to set up a Google Cloud project with service account authentication:

1. Create a new project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Sheets API and Google Drive API in the API Library
3. Create a service account and download the JSON key file
4. Share your Google Sheet with the service account email address
5. Add the service account credentials to your `.env.local` file

Note: For the dynamic sheet creation feature, you need both the Google Sheets API and Google Drive API enabled, and your service account needs both scopes:
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive`

## Security Considerations

1. **Service Account Authentication**: The application uses service account authentication to read data from Google Sheets, not user authentication.
2. **Credential Storage**: Service account credentials should be stored securely and not exposed to the client-side.
3. **Scope Limitation**: Only request the minimum required scopes for your application.
4. **Sheet Sharing**: Make sure to share your Google Sheet with the service account email address with appropriate permissions.
5. **User Isolation**: Each user gets their own sheet, preventing data conflicts between users.

## Architecture

The implementation follows a client-server architecture:

1. **Client-Side**: Displays the Google Sheets iframe for direct editing and handles user interactions
2. **Server-Side API Routes**: Handle Google Sheets API calls for reading, clearing, and creating data
3. **Google Sheets API**: Provides access to spreadsheet data
4. **Google Drive API**: Enables dynamic creation of new spreadsheets

This separation ensures that users can edit their sheets directly while the application can programmatically manage the data.

## Current Implementation Notes

The current implementation provides a seamless user experience:

1. Users automatically get their own Google Sheet when they navigate to the editor
2. The application can read data from the sheet via API
3. The sheet is automatically cleared after successful submission
4. All existing UI functionality is preserved
5. Users are isolated from each other, preventing data conflicts

For production use, you should:

1. Implement proper error handling and logging
2. Add rate limiting for API calls
3. Implement proper authentication for the API routes
4. Add input validation and sanitization
5. Set up proper monitoring and alerting
6. Implement a cleanup mechanism for old sheets
7. Add user identification based on actual authentication rather than random IDs

## Troubleshooting

### "Storage Quota Exceeded" Error

Even if you have sufficient storage space (e.g., 9GB used of 15GB), you might encounter this error due to:

1. **Hidden/System Files**: Google Drive counts hidden and system files toward your quota
2. **Trash/Recycle Bin**: Files in the trash still count toward your storage quota
3. **Temporary Quota Limits**: Google may impose temporary limits on API usage
4. **App-Specific Quotas**: Some Google APIs have per-app quotas

#### Solutions:

1. **Check Detailed Storage Usage**:
   - Go to [Google One storage page](https://one.google.com/storage)
   - Click on "Manage storage"
   - Look for any large files or unexpected storage usage

2. **Empty Trash Completely**:
   - Go to [Google Drive](https://drive.google.com)
   - Click on "Trash" in the left sidebar
   - Click "Empty trash" at the top

3. **Try Creating a Test Sheet Manually**:
   - Go to [Google Sheets](https://sheets.google.com)
   - Try creating a new blank spreadsheet
   - See if you get the same error

4. **Wait and Retry**:
   - Temporary quota limits may reset after some time
   - Try again after a few hours

5. **Use Template Approach**:
   - The system now falls back to copying a template sheet if creation fails
   - This reduces storage usage as it reuses an existing sheet structure

### "Permission Denied" Error

This usually occurs when:
1. The Google Drive API is not enabled
2. The service account doesn't have proper permissions
3. The scopes are incorrectly configured

#### Solutions:
1. Ensure both Google Sheets API and Google Drive API are enabled
2. Verify the service account credentials in your `.env.local` file
3. Check that the service account email is shared with appropriate permissions on any existing sheets

## Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Drive API Documentation](https://developers.google.com/drive)
- [Embedding Google Sheets](https://support.google.com/docs/answer/183965?co=GENIE.Platform%3DDesktop&hl=en)
- [Google Identity Platform Documentation](https://developers.google.com/identity)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)