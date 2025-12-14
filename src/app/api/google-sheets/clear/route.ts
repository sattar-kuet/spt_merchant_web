import { NextRequest } from 'next/server';
import { google } from 'googleapis';

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

// API route to clear data from Google Sheets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadsheetId, range = 'Sheet1!A2:Z1000' } = body;
    
    // Use the provided spreadsheetId or fallback to the environment variable
    const sheetId = spreadsheetId || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || 'placeholder-sheet-id';
    
    const sheets = await getAuthenticatedSheetsClient();
    
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range,
    });
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error clearing sheet data:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}