import Cookies from 'js-cookie';

// Utility functions for authentication
export const setAuthToken = (token: string) => {
  Cookies.set('access_token', token, {
    httpOnly: false, // Set to true if backend handles it
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: 7 // 7 days
  });
};

export const getAuthToken = () => {
  return Cookies.get('access_token');
};

export const removeAuthToken = () => {
  Cookies.remove('access_token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};