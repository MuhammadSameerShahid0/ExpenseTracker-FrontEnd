// API utility functions

export const getApiBaseUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isDevelopment 
    ? 'http://localhost:8000'  // Local development backend
    : ""; // Production backend (empty string means use same origin, Vercel rewrites handle /api/* paths)
};

// Global reference to the AuthContext logout function
let globalLogout = null;

export const setGlobalLogout = (logoutFunction) => {
  globalLogout = logoutFunction;
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
    
    // Check for 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      // If globalLogout function is available, use it to logout the user
      if (globalLogout) {
        globalLogout();
        // Redirect to homepage after logout
        window.location.href = '/';
      }
    }
    
    return response;
  } catch (error) {
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      throw new Error('CORS error: Unable to connect to server. Please check your network connection.');
    }
    throw error;
  }
};