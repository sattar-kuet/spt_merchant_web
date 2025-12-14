import { NextRequest } from 'next/server';
import { google } from 'googleapis';

// Function to get authenticated Google Drive client using service account
const getAuthenticatedDriveClient = async () => {
  try {
    // Use service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ],
    });

    const drive = google.drive({
      version: 'v3',
      auth,
    });

    return drive;
  } catch (error) {
    console.error('Error initializing Google Drive client:', error);
    throw new Error('Failed to initialize Google Drive client');
  }
};

// Function to get authenticated Google Sheets client using service account
const getAuthenticatedSheetsClient = async () => {
  try {
    // Use service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({
      version: 'v4',
      auth,
    });

    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw new Error('Failed to initialize Google Sheets client');
  }
};

// Function to ensure the app folder exists
const ensureAppFolderExists = async (drive: any) => {
  try {
    // Try to find existing folder
    const response = await drive.files.list({
      q: "name='SPT Merchant Sheets' and mimeType='application/vnd.google-apps.folder'",
      fields: 'files(id, name)'
    });
    
    const folders = response.data.files || [];
    
    if (folders.length > 0) {
      return folders[0].id;
    }
    
    // Create folder if it doesn't exist
    const createResponse = await drive.files.create({
      requestBody: {
        name: 'SPT Merchant Sheets',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });
    
    return createResponse.data.id;
  } catch (error) {
    console.error('Error ensuring app folder exists:', error);
    return null;
  }
};

// Function to check Drive storage quota
const checkStorageQuota = async (drive: any) => {
  try {
    const response = await drive.about.get({
      fields: 'storageQuota'
    });
    
    const quota = response.data.storageQuota;
    const used = parseInt(quota.usage || '0');
    const limit = parseInt(quota.limit || '0');
    
    console.log(`Storage usage: ${used} / ${limit} bytes`);
    
    if (limit > 0) {
      const percentage = (used / limit) * 100;
      console.log(`Storage usage: ${percentage.toFixed(2)}%`);
      
      // Warn if usage is over 90%
      if (percentage > 90) {
        console.warn('Warning: Storage usage is over 90%');
      }
    }
    
    return {
      used,
      limit,
      unlimited: quota.limit === undefined
    };
  } catch (error) {
    console.error('Error checking storage quota:', error);
    // Continue anyway, as this is just for diagnostics
    return null;
  }
};

// Function to cleanup old sheets (older than 1 hour) in the app folder
const cleanupOldSheets = async (drive: any, folderId: string | null) => {
  try {
    const cutoffDate = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    
    // Build query - either in folder or all sheets if no folder
    let query = `name contains 'SPT Merchant Bulk Parcel Sheet' and createdTime < '${cutoffDate.toISOString()}'`;
    if (folderId) {
      query += ` and '${folderId}' in parents`;
    }
    
    // Search for files created by our app with our naming pattern
    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, createdTime)',
      pageSize: 100,
    });
    
    const files = response.data.files || [];
    
    // Delete old files
    for (const file of files) {
      try {
        await drive.files.delete({ fileId: file.id });
        console.log(`Deleted old sheet: ${file.name}`);
      } catch (error) {
        console.error(`Error deleting sheet ${file.name}:`, error);
      }
    }
    
    return files.length;
  } catch (error) {
    console.error('Error during cleanup:', error);
    return 0;
  }
};

// API route to create a new Google Sheet
export async function POST(request: NextRequest) {
  let drive;
  
  try {
    const body = await request.json();
    const { title = 'SPT Merchant Bulk Parcel Sheet', userId } = body;
    
    drive = await getAuthenticatedDriveClient();
    
    // Check storage quota for diagnostics
    await checkStorageQuota(drive);
    
    // Option 1: Try to create a new sheet (existing approach)
    try {
      // Ensure app folder exists
      const folderId = await ensureAppFolderExists(drive);
      
      // Cleanup old sheets first
      const cleanedCount = await cleanupOldSheets(drive, folderId);
      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} old sheets`);
      }
      
      // Prepare file creation request
      const fileMetadata: any = {
        name: `${title} - ${userId || 'User'} - ${new Date().toISOString().split('T')[0]}`,
        mimeType: 'application/vnd.google-apps.spreadsheet',
      };
      
      // Add to folder if it exists
      if (folderId) {
        fileMetadata.parents = [folderId];
      }
      
      // Create a new spreadsheet
      const response = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id,webViewLink',
      });
      
      const spreadsheetId = response.data.id;
      const sheetUrl = response.data.webViewLink;
      
      if (!spreadsheetId) {
        throw new Error('Failed to create spreadsheet');
      }
      
      // Add headers to the new sheet
      const sheets = await getAuthenticatedSheetsClient();
      
      // Define headers for parcel data
      const headerValues = [
        ['Tracking ID', 'Recipient Name', 'Recipient Phone', 'Recipient Address', 
         'Area', 'District', 'Division', 'Product ID', 'Product Name', 'Quantity', 
         'Amount', 'Weight', 'Notes']
      ];
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1:M1',
        valueInputOption: 'RAW',
        requestBody: {
          values: headerValues,
        },
      });
      
      // Share the sheet with the service account (if needed)
      await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        },
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        spreadsheetId,
        sheetUrl
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (creationError) {
      // If creation fails, fall back to using a template
      console.log('Sheet creation failed, falling back to template approach');
      
      // Use the existing template sheet but create a copy for the user
      const templateSheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '1FnM5enepgMx13vBp3fyG7m8397UZSZOLWFcR_b0BOfU';
      
      // Create a copy of the template
      const copyResponse = await drive.files.copy({
        fileId: templateSheetId,
        requestBody: {
          name: `${title} - ${userId || 'User'} - COPY - ${new Date().toISOString().split('T')[0]}`,
        },
        fields: 'id,webViewLink',
      });
      
      const spreadsheetId = copyResponse.data.id;
      const sheetUrl = copyResponse.data.webViewLink;
      
      if (!spreadsheetId) {
        throw new Error('Failed to copy template spreadsheet');
      }
      
      // Clear the data (keep headers) in the copied sheet
      const sheets = await getAuthenticatedSheetsClient();
      
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'Sheet1!A2:Z1000', // Clear everything except headers
      });
      
      // Share the sheet with the service account (if needed)
      await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        },
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        spreadsheetId,
        sheetUrl
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error('Error creating sheet:', error);
    
    // Provide more specific error messages
    if (error.message.includes('storage quota')) {
      // Try to get more details about the quota
      if (drive) {
        try {
          await checkStorageQuota(drive);
        } catch (quotaError) {
          console.error('Error checking quota for diagnostics:', quotaError);
        }
      }
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Storage quota exceeded. Please free up space in Google Drive or upgrade your storage plan.',
        details: 'This error can sometimes occur even with sufficient space due to temporary quota limits or system files.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Handle permission errors
    if (error.message.includes('permission') || error.code === 403) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Permission denied. Please check that the Google Drive API is enabled and the service account has proper permissions.',
        details: error.message
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      details: error.code ? `Error code: ${error.code}` : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}