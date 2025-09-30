// API Configuration
import { makeApiRequest } from '../utils/api';

// API endpoints configuration - Using relative paths to leverage Vercel rewrites
export const API_ENDPOINTS = {
  // Authentication
  VERIFY_TOKEN: '/api/verify-token',
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/logout',
  
  // User
  USER_DETAILS: '/api/user_details',
  UPDATE_USER: '/api/update_user',
  DELETE_USER: '/api/delete_user',
  
  // Expenses
  EXPENSES: '/api/expenses',
  ADD_EXPENSE: '/api/expenses',
  EDIT_EXPENSE: '/api/edit_expense_list',
  DELETE_EXPENSE: (transactionId) => `/api/delete_expense_list_item?transaction_id=${transactionId}`,
  
  // Categories
  CATEGORIES: '/api/categories',
  
  // Statistics
  TOTAL_AMOUNT: '/api/total_amount',
  TOTAL_TRANSACTIONS: '/api/total_transactions',
  RECENT_TRANSACTIONS: '/api/recent_transactions',
  
  // Budgets
  BUDGETS: '/api/budgets',
  ADD_BUDGET: '/api/add-budget',
  EDIT_BUDGET_AMOUNT: '/api/Edit_budget_amount',
  DELETE_BUDGET: (categoryId) => `/api/delete_set_budget?category_id=${categoryId}`,
  TOTAL_BUDGET_AMOUNT: (month) => `/api/total-set-budget-amount-according-to-month?month=${month}`,
  
  // Reports
  EXPENSES_BY_CATEGORY: '/api/expenses-by-category',
  EXPENSES_BY_MONTH: '/api/expenses-by-month',
  
  // Account Reactivation
  REACTIVATE_ACCOUNT_REQUEST: '/api/re-active-account',
  REACTIVATE_ACCOUNT_VERIFY: '/api/re-active-account-verification-email-code',
};

// Common headers for API requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
};

// Function to get auth headers with token
export const getAuthHeaders = (token = localStorage.getItem('token'), additionalHeaders = {}) => {
  return {
    ...API_HEADERS,
    'Authorization': `Bearer ${token}`,
    ...additionalHeaders,
  };
};

// API utility functions
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await makeApiRequest(endpoint, options);
    return response;
  } catch (error) {
    console.error(`API request failed for endpoint: ${endpoint}`, error);
    throw error;
  }
};

export const apiGet = async (endpoint, headers = {}) => {
  const options = {
    method: 'GET',
    headers: { ...getAuthHeaders(undefined, headers) },
  };
  return apiRequest(endpoint, options);
};

export const apiPost = async (endpoint, body, headers = {}) => {
  const options = {
    method: 'POST',
    headers: { ...getAuthHeaders(undefined, headers) },
    body: JSON.stringify(body),
  };
  return apiRequest(endpoint, options);
};

export const apiPut = async (endpoint, body, headers = {}) => {
  const options = {
    method: 'PUT',
    headers: { ...getAuthHeaders(undefined, headers) },
    body: JSON.stringify(body),
  };
  return apiRequest(endpoint, options);
};

export const apiDelete = async (endpoint, headers = {}) => {
  const options = {
    method: 'DELETE',
    headers: { ...getAuthHeaders(undefined, headers) },
  };
  return apiRequest(endpoint, options);
};