import { NextRequest } from 'next/server';
import { google } from 'googleapis';
import { auth } from '@/lib/auth-google';

// Template headers matching single parcel add form
const TEMPLATE_HEADERS = [
  'Customer Name',
  'Customer Phone',
  'Customer Address',
  'District',
  'City',
  'Pickup Point',
  'Parcel Weight (kg)',
  'Parcel Type',
  'COD Amount'
];

// API route to create a new Google Sheet using user's OAuth token
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated session
    const session = await auth();

    if (!session || !session.accessToken) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Not authenticated. Please sign in with Google.',
        requiresAuth: true
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { title = 'SPT Merchant Bulk Parcel Sheet', userId } = body;

    // Create OAuth2 client with user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    // Create Drive API client
    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });

    // Create Sheets API client
    const sheets = google.sheets({
      version: 'v4',
      auth: oauth2Client,
    });

    // Create a new spreadsheet in user's Drive
    const fileMetadata = {
      name: `${title} - ${userId || 'User'} - ${new Date().toISOString().split('T')[0]}`,
      mimeType: 'application/vnd.google-apps.spreadsheet',
    };

    console.log('📄 Creating sheet with metadata:', fileMetadata);

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id,webViewLink',
    });

    const spreadsheetId = response.data.id;
    const sheetUrl = response.data.webViewLink;

    if (!spreadsheetId) {
      throw new Error('Failed to create spreadsheet');
    }

    console.log('✅ Sheet created:', spreadsheetId);

    // Add template headers to the new sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:I1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [TEMPLATE_HEADERS],
      },
    });

    console.log('✅ Headers added');

    // Format the header row (bold, background color)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.2,
                    green: 0.5,
                    blue: 0.8,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0,
                    },
                    fontSize: 11,
                    bold: true,
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: {
                  frozenRowCount: 1,
                },
              },
              fields: 'gridProperties.frozenRowCount',
            },
          },
        ],
      },
    });

    console.log('✅ Headers formatted');

    return new Response(JSON.stringify({
      success: true,
      spreadsheetId,
      sheetUrl,
      user: session.user?.email,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Error creating sheet:', error);

    // Handle specific errors
    if (error.code === 401) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authentication expired. Please sign in again.',
        requiresAuth: true
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to create Google Sheet',
      details: error.code ? `Error code: ${error.code}` : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}