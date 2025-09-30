// API utility functions
export const getApiBaseUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isDevelopment 
    ? 'http://localhost:8000'  // Local development backend
    : ""; // Production backend
};

export const makeApiRequest = async (endpoint, options = {}) => {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies/sessions
    mode: 'cors' // Explicitly set CORS mode
  };
  
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
   try {
    const response = await fetch(url, requestOptions);
    
    // Handle CORS errors
    if (response.type === 'opaque' || response.status === 0) {
      throw new Error('CORS error: Unable to connect to server');
    }
    
    return response;
  } catch (error) {
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      throw new Error('CORS error: Unable to connect to server. Please check your network connection.');
    }
    throw error;
  }
};