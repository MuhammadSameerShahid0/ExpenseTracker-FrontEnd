import { makeApiRequest } from '../utils/api';

export const budgetService = {
  // Add a new budget
  async addBudget(limit, categoryId) {
    const token = localStorage.getItem('token');
    
    const response = await makeApiRequest('/api/add-budget', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        limit: limit,
        category_id: categoryId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to add budget');
    }

    return await response.json();
  },

  // Get all budgets for the user
  async getBudgets(month = null) {
    const token = localStorage.getItem('token');
    let url = '/api/budgets';
    
    if (month !== null) {
      url += `?month=${month}`;
    }
    
    const response = await makeApiRequest(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch budgets');
    }

    return await response.json();
  },

  // Get categories for budget creation
  async getCategories() {
    const token = localStorage.getItem('token');
    
    const response = await makeApiRequest('/api/categories', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch categories');
    }

    return await response.json();
  },

  // Get total set budget amount according to month
  async getTotalBudgetAmountForMonth(month) {
    const token = localStorage.getItem('token');
    
    const response = await makeApiRequest(`/api/total-set-budget-amount-according-to-month?month=${month}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch total budget amount');
    }

    return await response.json();
  },

  // Edit budget amount
  async editBudgetAmount(categoryId, amount) {
    const token = localStorage.getItem('token');
    
    const response = await makeApiRequest('/api/Edit_budget_amount', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_id: categoryId,
        amount: amount
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to edit budget amount');
    }

    return await response.json();
  },

  // Delete budget
  async deleteBudget(categoryId) {
    const token = localStorage.getItem('token');
    
    const response = await makeApiRequest(`/api/delete_set_budget?category_id=${categoryId}`, {        
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete budget');
    }

    return await response.json();
  },

  // Get budget against transactions data
  async getBudgetAgainstTransactions() {
    const token = localStorage.getItem('token');
    
    const response = await makeApiRequest('/api/budget-against-transactions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch budget against transactions data');
    }

    return await response.json();
  }
};