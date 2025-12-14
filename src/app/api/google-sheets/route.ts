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

// API route to read data from Google Sheets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { range = 'Sheet1!A1:Z1000' } = body;
    
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || 'placeholder-sheet-id';
    
    const sheets = await getAuthenticatedSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    // Transform the data into parcel objects
    const data = response.data.values || [];
    
    if (data.length === 0) {
      return new Response(JSON.stringify({ success: true, data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Assuming the first row contains headers
    const headers = data[0];
    const parcels = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const parcel: any = {};
      
      for (let j = 0; j < headers.length; j++) {
        parcel[headers[j]] = row[j] || '';
      }
      
      parcels.push(parcel);
    }
    
    return new Response(JSON.stringify({ success: true, data: parcels }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error reading sheet data:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Separate endpoint for clearing data
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { range = 'Sheet1!A2:Z1000' } = body;
    
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || 'placeholder-sheet-id';
    
    const sheets = await getAuthenticatedSheetsClient();
    
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
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