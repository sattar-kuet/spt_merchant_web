// Function to read data from Google Sheets via API
export const readSheetData = async (spreadsheetId: string, range: string = 'Sheet1!A1:Z1000') => {
  try {
    const response = await fetch('/api/google-sheets/read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spreadsheetId, range }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to read sheet data');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error reading sheet data:', error);
    throw error;
  }
};

// Function to clear data from Google Sheets via API
export const clearSheetData = async (spreadsheetId: string, range: string = 'Sheet1!A2:Z1000') => {
  try {
    const response = await fetch('/api/google-sheets/clear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spreadsheetId, range }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to clear sheet data');
    }
  } catch (error) {
    console.error('Error clearing sheet data:', error);
    throw error;
  }
};

// Function to create a new Google Sheet
export const createSheet = async (title?: string, userId?: string) => {
  try {
    const response = await fetch('/api/google-sheets/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, userId }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create sheet');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating sheet:', error);
    throw error;
  }
};