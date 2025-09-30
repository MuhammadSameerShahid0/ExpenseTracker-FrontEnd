import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BudgetModal from './BudgetModal';
import { makeApiRequest } from '../utils/api';
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBudgetMonth, setSelectedBudgetMonth] = useState(new Date());
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [activeMonthPicker, setActiveMonthPicker] = useState('main'); // 'main' or 'budget'
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyTransactions, setMonthlyTransactions] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetModalTab, setBudgetModalTab] = useState('add'); // Default to 'add'
  const [monthlyIncome, setMonthlyIncome] = useState(0); // For financial dashboard
  const [savings, setSavings] = useState(0); // For financial dashboard
  const [expenseTrend, setExpenseTrend] = useState([]); // For trend analysis

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    verifyToken(token);
  }, [navigate]);

  // Group by category from ALL transactions
  const categoryTotals = transactions.reduce((acc, tx) => {
    const catName = tx.category_name || "Uncategorized";
    acc[catName] = (acc[catName] || 0) + tx.amount;
    return acc;
  }, {});

  // Calculate financial metrics
  const calculateSavings = () => {
    return monthlyIncome - monthlyExpenses;
  };

  // Calculate expense trend (for simple trend analysis)
  useEffect(() => {
    if (transactions.length > 0) {
      // Get the 5 most recent transactions for trend analysis
      const recentTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      ).slice(0, 5);
      
      setExpenseTrend(recentTransactions);
    }
  }, [transactions]);

  // Calculate budget utilization percentage
  const budgetUtilization = totalBudget > 0 ? (monthlyExpenses / totalBudget) * 100 : 0;

  // ✅ Build pie chart data using categories + transaction totals
  const pieChartData = categories.map((cat, index) => {
    const value = categoryTotals[cat.name] || 0; // use category name from categories
    const percentage = totalExpenses > 0 ? (value / totalExpenses) * 100 : 0;
    const color = `hsl(${(index * 137) % 360}, 70%, 60%)`;

    return {
      name: cat.name,
      value,
      percentage,
      color,
    };
  });

  // ✅ Calculate slice angles
  let cumulativeAngle = 0;
  const pieChartSlices = pieChartData.map((item) => {
    const angle = (item.value / totalExpenses) * 360;
    const slice = {
      ...item,
      startAngle: cumulativeAngle,
      endAngle: cumulativeAngle + angle,
    };
    cumulativeAngle += angle;
    return slice;
  });

  const verifyToken = async (token) => {
    try {
      const response = await makeApiRequest('/api/verify-token', {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        fetchDashboardData(token);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (token, userId) => {
    await Promise.all([
      fetchTotals(token),
      fetchTransactionsCount(token),
      fetchTransactions(token),
      fetchLatestTransactions(token),
      fetchCategories(token),
      fetchMonthlyData(
        token,
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1
      ),
      fetchTotalBudgetForMonth(token, selectedBudgetMonth.getMonth() + 1)
    ]);
  };

  // ✅ Fetch total expenses
  const fetchTotals = async (token) => {
    try {
      const res = await makeApiRequest('/api/total_amount', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTotalExpenses(data);
      }
    } catch (err) {
      console.error("Failed to fetch total expenses:", err);
    }
  };

  // ✅ Fetch all transactions
  const fetchTransactions = async (token) => {
    try {
      const res = await makeApiRequest('/api/expenses', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  // ✅ Fetch total transactions
  const fetchTransactionsCount = async (token) => {
    try {
      const res = await makeApiRequest('/api/total_transactions', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTotalTransactions(data.total_transactions);
      }
    } catch (err) {
      console.error("Failed to fetch total transactions:", err);
    }
  };

  // ✅ Fetch latest 5 transactions
  const fetchLatestTransactions = async (token) => {
    try {
      const res = await makeApiRequest('/api/recent_transactions?limit=6', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLatestTransactions(data);
      }
    } catch (err) {
      console.error("Failed to fetch latest transactions:", err);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async (token) => {
    try {
      const res = await makeApiRequest('/api/categories', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // ✅ Fetch monthly totals + transaction counts
  const fetchMonthlyData = async (token, year, month) => {
    try {
      const formattedMonth = month.toString().padStart(2, "0");

      const expenseRes = await makeApiRequest(
        `/api/monthly_total?year=${year}&month=${formattedMonth}`,
        {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (expenseRes.ok) {
        const data = await expenseRes.json();
        setMonthlyExpenses(data);
      } else {
        setMonthlyExpenses(0);
      }

      const txRes = await makeApiRequest(
        `/api/monthly_transactions?year=${year}&month=${formattedMonth}`,
        {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (txRes.ok) {
        const data = await txRes.json();
        setMonthlyTransactions(data);
      } else {
        setMonthlyTransactions(0);
      }
    } catch (err) {
      console.error("Failed to fetch monthly data:", err);
      setMonthlyExpenses(0);
      setMonthlyTransactions(0);
    }
  };

  // ✅ Fetch total budget for the month
  const fetchTotalBudgetForMonth = async (token, month) => {
    try {
      const response = await makeApiRequest(`/api/total-set-budget-amount-according-to-month?month=${month}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTotalBudget(data);
      } else {
        setTotalBudget(0);
      }
    } catch (err) {
      console.error("Failed to fetch total budget for month:", err);
      setTotalBudget(0);
    }
  };

  const handleMonthChange = (newDate) => {
    setSelectedDate(newDate);
    setShowMonthPicker(false);

    const token = localStorage.getItem("token");
    if (token) {
      fetchMonthlyData(token, newDate.getFullYear(), newDate.getMonth() + 1);
    }
  };

  const handleBudgetMonthChange = (newDate) => {
    setSelectedBudgetMonth(newDate);
    setShowMonthPicker(false);

    const token = localStorage.getItem("token");
    if (token) {
      fetchTotalBudgetForMonth(token, newDate.getMonth() + 1);
    }
  };

  const handleMonthPickerSelect = (newDate) => {
    if (activeMonthPicker === 'main') {
      handleMonthChange(newDate);
    } else {
      handleBudgetMonthChange(newDate);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await makeApiRequest('/api/categories', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: newCategory,
          type: "expense",
        }),
      });

      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setNewCategory("");
        setShowAddCategory(false);
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to add category");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const getExpenseCategories = () => {
    return categories.filter((category) => category.type === "expense");
  };

  const MonthPicker = () => {
    if (!showMonthPicker) return null;

    // Use the appropriate date based on which picker is active
    const pickerDate = activeMonthPicker === 'main' ? selectedDate : selectedBudgetMonth;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    return (
      <div
        className="month-picker-overlay"
        onClick={() => setShowMonthPicker(false)}
      >
        <div className="month-picker" onClick={(e) => e.stopPropagation()}>
          <div className="month-picker-header">
            <h3>Select Month</h3>
            <button
              className="month-picker-close"
              onClick={() => setShowMonthPicker(false)}
            >
              &times;
            </button>
          </div>

          <div className="month-picker-content">
            {/* Show year selector only for main picker, not for budget picker */}
            {activeMonthPicker === 'main' && (
              <div className="year-selector">
                {years.map((year) => (
                  <div
                    key={year}
                    className={`year-option ${
                      pickerDate.getFullYear() === year ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleMonthPickerSelect(new Date(year, pickerDate.getMonth(), 1))
                    }
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}

            <div className="month-grid">
              {months.map((month, index) => (
                <div
                  key={index}
                  className={`month-option ${
                    (activeMonthPicker === 'main' 
                      ? pickerDate.getMonth() === index 
                      : selectedBudgetMonth.getMonth() === index) 
                      ? "selected" 
                      : ""
                  }`}
                  onClick={() =>
                    handleMonthPickerSelect(
                      new Date(
                        activeMonthPicker === 'main' 
                          ? pickerDate.getFullYear() 
                          : currentYear, // Use current year for budget picker
                        index, 
                        1
                      )
                    )
                  }
                >
                  {month.substring(0, 3)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate("/login")} className="btn btn-primary">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>
              PKR <span style={{ color: "#4361ee" }}>{totalExpenses.toFixed(2)}</span>
            </h3>
            <p>Total Spent Amount</p>
          </div>

          <div className="stat-card">
            <h3>
              PKR <span style={{ color: "#4361ee" }}>{monthlyExpenses.toFixed(2)}</span>
            </h3>
            <div className="month-selector-container">
              <div
                className="current-month-display"
                onClick={() => {
                  setActiveMonthPicker('main');
                  setShowMonthPicker(true);
                }}
              >
                {selectedDate.toLocaleString("default", { month: "long" })}{" "}
                {selectedDate.getFullYear()}
                <span>&nbsp;(Spent)</span>                 
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3>
              PKR <span style={{ color: "#28a745" }}>{totalBudget.toFixed(2)}</span>
            </h3>
            <div className="month-selector-container budget-controls">
              <button 
                className="budget-control-btn view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setBudgetModalTab('view');
                  setShowBudgetModal(true);
                }}
                title="View Budgets"
              >
                👁️
              </button>
              <div
                className="current-month-display budget-month-display"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMonthPicker('budget');
                  setShowMonthPicker(true);
                }}
              >
                Budget for {selectedBudgetMonth.toLocaleString("default", { month: "long" })}
              </div>
              <button 
                className="budget-control-btn add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setBudgetModalTab('add');
                  setShowBudgetModal(true);
                }}
                title="Add Budget"
              >
                +
              </button>
            </div>
          </div>

          <div className="stat-card">
            <h3>{totalTransactions}</h3>
            <p>Transactions</p>
          </div>
        </div>

        {/* Financial Insights Section */}
        <div className="financial-insights">
          <div className="insight-card">
            <h3>Monthly Budget Utilization</h3>
            <div className="budget-utilization-bar">
              <div 
                className="budget-progress"
                style={{ 
                  width: `${Math.min(budgetUtilization, 100)}%`,
                  backgroundColor: budgetUtilization > 90 ? '#dc3545' : budgetUtilization > 75 ? '#ffc107' : '#28a745'
                }}
              ></div>
            </div>
            <p className="budget-percentage">{budgetUtilization.toFixed(1)}% of budget used</p>
          </div>
          
          <div className="insight-card">
            <h3>Financial Health</h3>
            <div className="financial-health">
              <div className="health-indicator">
                {monthlyExpenses < totalBudget * 0.5 ? (
                  <span className="health-status good">🟢 Excellent</span>
                ) : monthlyExpenses < totalBudget ? (
                  <span className="health-status fair">🟡 Good</span>
                ) : (
                  <span className="health-status poor">🔴 Needs Attention</span>
                )}
              </div>
              <p>Based on budget utilization</p>
            </div>
          </div>
          
          <div className="insight-card">
            <h3>Top Expense Category</h3>
            <div className="top-category">
              {pieChartData.length > 0 ? (
                <>
                  <span className="category-name">{pieChartData[0].name}</span>
                  <span className="category-percentage">{pieChartData[0].percentage.toFixed(1)}%</span>
                </>
              ) : (
                <span className="no-data">No data available</span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Financial Summary */}
        <div className="financial-summary">
          <div className="summary-card">
            <h3>Spending Trend</h3>
            <div className="trend-chart">
              {expenseTrend.length > 0 ? (
                <div className="trend-visualization">
                  {expenseTrend.slice(0, 5).map((expense, index) => (
                    <div key={index} className="trend-bar" title={`PKR ${expense.amount.toFixed(2)}`}>
                      <div 
                        className="trend-bar-fill" 
                        style={{ height: `${(expense.amount / Math.max(...expenseTrend.map(e => e.amount)) * 100)}%` }}
                      ></div>
                      <div className="trend-label">
                        {new Date(expense.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No trend data available</p>
              )}
            </div>
          </div>

          <div className="summary-card">
            <h3>Savings Projection</h3>
            <div className="savings-info">
              <div className="savings-amount">
                <span className={`savings-value ${totalBudget - monthlyExpenses < 0 ? 'negative' : ''}`}>
                  PKR {(totalBudget - monthlyExpenses).toFixed(2)}
                </span>
                <span className="savings-label">
                  remaining in budget
                </span>
              </div>
              <div className="savings-percentage">
                <span className={`percentage-value ${totalBudget - monthlyExpenses < 0 ? 'negative' : ''}`}>
                  {totalBudget > 0 ? ((totalBudget - monthlyExpenses) / totalBudget * 100).toFixed(1) : 0}%
                </span>
                <span className="percentage-label">
                  of budget remaining
                </span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <h3>Spending vs Budget</h3>
            <div className="comparison-chart">
              <div className="comparison-item">
                <div className="comparison-label">Budget</div>
                <div className="comparison-value">PKR {totalBudget.toFixed(2)}</div>
                <div className="comparison-bar">
                  <div 
                    className="comparison-progress" 
                    style={{ width: "100%", backgroundColor: "#28a745" }}
                  ></div>
                </div>
              </div>
              <div className="comparison-item">
                <div className="comparison-label">Spent</div>
                <div className="comparison-value">PKR {monthlyExpenses.toFixed(2)}</div>
                <div className="comparison-bar">
                  <div 
                    className="comparison-progress" 
                    style={{ 
                      width: totalBudget > 0 ? `${Math.min((monthlyExpenses / totalBudget) * 100, 100)}%` : "0%", 
                      backgroundColor: monthlyExpenses > totalBudget ? "#dc3545" : "#4361ee"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Latest Transactions */}
          <div className="content-section">
            <div className="section-header">
              <h2>Latest Transactions</h2>
            </div>

            <div className="transactions-list-modern">
              {latestTransactions.length > 0 ? (
                latestTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-card">
                    <div className="transaction-left">
                      <div className="transaction-icon">
                        <span>💸</span>
                      </div>
                      <div className="transaction-info">
                        <div className="transaction-description">
                          {transaction.description || "No description"}
                        </div>
                        <div className="transaction-meta">
                          <span className="transaction-category">
                            {transaction.category_name} • {transaction.payment_method}
                          </span>
                          <span className="transaction-date">
                            {new Date(transaction.date).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="transaction-right">
                      <span className="transaction-amount">
                        - PKR {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">
                  No transactions yet. Start tracking your expenses!
                </p>
              )}
            </div>
          </div>

          {/* Expense Distribution */}
          <div className="content-section">
            <div className="section-header">
              <h2>Expense Distribution</h2>
            </div>

            <div className="chart-container">
              <div className="pie-chart-wrapper">
                <div className="pie-chart">
                  {pieChartSlices.length > 0 ? (
                    pieChartSlices.map((slice) => (
                      <div
                        key={slice.name}
                        className="chart-slice"
                        style={{
                          "--start": slice.startAngle,
                          "--value": slice.endAngle - slice.startAngle,
                          "--color": slice.color,
                          "--hover-color": `${slice.color.replace(
                            "60%)",
                            "70%)"
                          )}`,
                        }}
                        title={`${slice.name}: PKR ${slice.value.toFixed(
                          2
                        )} (${slice.percentage.toFixed(1)}%)`}
                      >
                        <div className="slice-inner"></div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No expense data available</p>
                  )}

                  <div className="chart-center">
                    <span className="chart-total">
                       {totalExpenses.toFixed(0)}
                    </span>
                    <span className="chart-label">Total</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="chart-legend">
                {pieChartData.map((item) => (
                  <div key={item.name} className="legend-item">
                    <div
                      className="color-dot"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-percentage">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MonthPicker />
      <BudgetModal 
        isOpen={showBudgetModal} 
        onClose={() => setShowBudgetModal(false)} 
        initialTab={budgetModalTab} 
      />
    </div>
  );
};

export default Dashboard;