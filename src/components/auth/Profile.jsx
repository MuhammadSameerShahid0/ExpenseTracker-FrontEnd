import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeApiRequest } from '../../utils/api';
import './Auth.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlySpent: 0
  });
  const [membershipDays, setMembershipDays] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      Promise.all([
        fetchUserProfile(token),
        fetchUserStats(token),
        fetchMonthlySpent(token),
        fetchTotalBudgetForMonth(token, new Date().getMonth() + 1)
      ]).then(() => {
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      });
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await makeApiRequest('/api/user_details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        
        // Calculate membership days
        if (data.created_at) {
          const createdDate = new Date(data.created_at);
          const today = new Date();
          const daysSinceJoin = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
          setMembershipDays(daysSinceJoin);
        }
        
        return true;
      } else {
        localStorage.removeItem('token');
        navigate('/login');
        return false;
      }
    } catch (error) {
      setError('Failed to fetch user profile');
      localStorage.removeItem('token');
      navigate('/login');
      return false;
    }
  };

  const fetchUserStats = async (token) => {
    try {
      // Fetch total expense amount
      const totalAmountResponse = await makeApiRequest('/api/total_amount', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (totalAmountResponse.ok) {
        const totalAmountData = await totalAmountResponse.json();
        console.log('Total amount data:', totalAmountData);
        setStats(prev => ({
          ...prev,
          totalExpenses: typeof totalAmountData === 'number' ? totalAmountData : totalAmountData.total_amount || 0
        }));
      } else {
        console.error('Failed to fetch total amount:', totalAmountResponse.status);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return false;
    }
  };

  const fetchMonthlySpent = async (token) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
      
      const response = await makeApiRequest(`/api/monthly_total?year=${year}&month=${month}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const monthlySpentData = await response.json();
        console.log('Monthly spent data:', monthlySpentData);
        setStats(prev => ({
          ...prev,
          monthlySpent: monthlySpentData || 0
        }));
      } else {
        console.error('Failed to fetch monthly spent:', response.status);
        setStats(prev => ({
          ...prev,
          monthlySpent: 0
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to fetch monthly spent:', error);
      setStats(prev => ({
        ...prev,
        monthlySpent: 0
      }));
      return false;
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="profile-container">          
          <div className="profile-content">
            {/* Profile Card */}
            <div className="modern-card">
              <div className="card-header">
                <div className="header-content">
                  <div className="avatar-container">
                    <div className="user-avatar-large">
                      <span className="avatar-initials-large">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    {user && (
                      <div className="user-status-badge">
                        <div className="status-indicator online"></div>
                        <span className="status-text">Online</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="user-info">
                    <h2 className="user-name">{user?.fullname || user?.username || 'User'}</h2>
                    <p className="user-email">{user?.email || 'user@example.com'}</p>
                    
                    <div className="user-stats">
                      <div className="stat-item">
                        <span className="stat-value">PKR {stats.totalExpenses.toFixed(2)}</span>
                        <span className="stat-label">Total Spent</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">PKR {stats.monthlySpent.toFixed(2)}</span>
                        <span className="stat-label">This Month ({new Date().toLocaleString('default', { month: 'long' })})</span>
                      </div>
                       <div className="stat-item">
                        <span className="stat-value">PKR {totalBudget.toFixed(2)}</span>
                        <span className="stat-label">Budget for this month ({new Date().toLocaleString('default', { month: 'long' })})</span>
                      </div>
                      <div className="stat-item membership-stat">
                        <span className="stat-value">{membershipDays}</span>
                        <span className="stat-label">Days with us 🎉</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="profile-details-grid">
                <div className="profile-card">
                  <div className="card-content">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21C20 19.1435 19.2625 17.363 17.9497 16.0503C16.637 14.7375 14.8565 14 13 14H11C9.14348 14 7.36301 14.7375 6.05025 16.0503C4.7375 17.363 4 19.1435 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <h3>Personal Information</h3>
                      <p><strong>Full Name:</strong> {user?.fullname || 'Not provided'}</p>
                      <p><strong>Username:</strong> {user?.username || 'Not provided'}</p>
                      <p><strong>Join Date:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="profile-card">
                  <div className="card-content">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 12H12M12 12H8M12 12V16M12 12V8M12 12L8.5 15.5M12 12L15.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <h3>Contact Information</h3>
                      <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="profile-card">
                  <div className="card-content">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <h3>Security</h3>
                      <p>
                        <strong>2FA Status:</strong>
                        <span className={`status-badge ${user?.status_2fa ? 'enabled' : 'disabled'}`}>
                          {user?.status_2fa ? 'Enabled' : 'Disabled'}
                        </span>
                      </p>
                      <p><strong>Last Login:</strong> Today</p>
                    </div>
                  </div>
                </div>
                
                <div className="profile-card">
                  <div className="card-content">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.976 5.55183 15.3026 6.221 16.538 5.91917C18.2907 5.49146 19.5085 7.21917 18.7739 8.68269C18.3563 9.51768 18.6101 10.5378 19.3782 11.2173C21.2087 12.8465 20.1772 15.8302 18.2261 15.8302C17.102 15.8302 16.2087 16.6333 16.2087 17.7574C16.2087 18.8814 17.102 19.6846 18.2261 19.6846C20.1772 19.6846 21.2087 22.6683 19.3782 24.2975C18.6101 24.977 18.3563 25.9971 18.7739 26.8321C19.5085 28.2956 18.2907 30.0233 16.538 29.5956C15.3026 29.2938 13.976 29.9629 13.6754 31.1975C13.249 32.9539 10.751 32.9539 10.3246 31.1975C9.9003 29.4502 8.04153 28.9531 6.8071 29.8183C5.05177 31.0748 3.82691 29.85 4.30781 28.1059C4.50795 27.3637 4.17276 26.5732 3.538 26.2975C1.6979 25.5061 1.6979 22.9939 3.538 22.2025C4.17276 21.9268 4.50795 21.1363 4.30781 20.3941C3.82691 18.65 5.05177 17.4252 6.8071 18.6817C8.04153 19.5469 9.9003 19.0498 10.3246 17.2025C10.749 15.4552 8.89025 14.9581 7.65582 15.8233C5.9005 17.0798 4.67563 15.855 5.15653 14.1109C5.35667 13.3687 5.02148 12.5782 4.38672 12.3025C2.54662 11.5111 2.54662 8.99886 4.38672 8.20747C5.02148 7.93177 5.35667 7.14127 5.15653 6.39903C4.67563 4.65497 5.9005 3.43011 7.65582 4.68663C8.89025 5.55183 10.749 5.05471 10.3246 3.20744Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="detail-content">
                      <h3>Account Settings</h3>
                      <p>Manage your account preferences and security settings</p>
                      <button 
                        className="btn btn-outline"
                        onClick={() => navigate('/account-settings')}
                      >
                        Manage Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;