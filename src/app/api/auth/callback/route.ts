import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Authorization code not found', { status: 400 });
  }

  // Redirect back to the bulk parcel page
  const redirectUrl = new URL('/parcels/add-parcel/bulk-parcel', process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000');

  return new Response(null, {
    status: 302,
    headers: {
      'Location': redirectUrl.toString(),
    },
  });
}
