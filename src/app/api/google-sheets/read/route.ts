import { NextRequest } from 'next/server';
import { google } from 'googleapis';
import { auth } from '@/lib/auth-google';

// API route to read data from Google Sheets using user's OAuth token
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
    const { spreadsheetId, range = 'Sheet1!A1:Z1000' } = body;

    // Create OAuth2 client with user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });

    const sheets = google.sheets({
      version: 'v4',
      auth: oauth2Client,
    });

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

    // Handle auth errors
    if (error.code === 401 || error.code === 403) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication failed or expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}