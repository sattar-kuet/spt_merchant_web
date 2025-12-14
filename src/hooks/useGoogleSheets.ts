import { useState } from 'react';
import { readSheetData, clearSheetData, createSheet } from '@/lib/googleSheets';

export const useGoogleSheets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSheetId, setCurrentSheetId] = useState<string | null>(null);

  // Function to create a new Google Sheet
  const createNewSheet = async (title?: string, userId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createSheet(title, userId);
      setCurrentSheetId(result.spreadsheetId);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create Google Sheet');
      console.error('Error creating sheet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to read parcel data from the Google Sheet
  const readParcelData = async (range: string = 'Sheet1!A1:Z1000') => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentSheetId) {
        throw new Error('No active sheet. Please create a sheet first.');
      }
      const data = await readSheetData(currentSheetId, range);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to read parcel data from Google Sheets');
      console.error('Error reading parcel data:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to clear the Google Sheet after successful submission
  const clearSheet = async (range: string = 'Sheet1!A2:Z1000') => {
    setLoading(true);
    setError(null);
    
    try {
      if (!currentSheetId) {
        throw new Error('No active sheet. Please create a sheet first.');
      }
      await clearSheetData(currentSheetId, range);
    } catch (err: any) {
      setError(err.message || 'Failed to clear Google Sheet');
      console.error('Error clearing sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    currentSheetId,
    createNewSheet,
    readParcelData,
    clearSheet,
  };
};