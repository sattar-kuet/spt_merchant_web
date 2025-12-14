// Function to generate the Google OAuth2 authentication URL
export const generateAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  const scope = process.env.NEXT_PUBLIC_GOOGLE_SHEET_SCOPES || 'https://www.googleapis.com/auth/spreadsheets';
  
  if (!clientId || !redirectUri) {
    throw new Error('Google OAuth2 credentials not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Function to exchange authorization code for tokens
export const exchangeCodeForTokens = async (code: string) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
  
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Google OAuth2 credentials not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code: code,
    }),
  });

  const tokens = await response.json();
  
  if (!response.ok) {
    throw new Error(tokens.error_description || 'Failed to exchange code for tokens');
  }
  
  return tokens;
};