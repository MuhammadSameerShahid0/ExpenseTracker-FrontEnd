// API utility functions
export const getApiBaseUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isDevelopment 
    ? 'http://localhost:8000'  // Local development backend
    : 'https://expense-tracker-python-fast-api.vercel.app'; // Production backend
};

export const makeApiRequest = async (endpoint, options = {}) => {
  const apiBaseUrl = getApiBaseUrl();
  const url = `${apiBaseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  const response = await fetch(url, requestOptions);
  return response;
};