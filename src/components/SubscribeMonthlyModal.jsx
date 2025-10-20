import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscribeMonthlyModal.css';
import { makeApiRequest } from '../utils/api';

const SubscribeMonthlyModal = ({ open, onClose, userName, userEmail, userSubscriberStatus }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'subscribe' or 'unsubscribe'
  const [showResult, setShowResult] = useState(false); // Show result after API call
  const navigate = useNavigate();

  // Helper to clear auth token from various storage locations (localStorage, sessionStorage, cookies)
  const clearAuthToken = () => {
    try {
      // Remove from localStorage and sessionStorage
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      // Clear common cookie names that might store tokens
      const cookieNames = ['token', 'auth_token', 'access_token', 'sessionid'];
      cookieNames.forEach((name) => {
        // Set cookie expiry in the past for current path
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        // Also try clearing without path (some cookies may be set that way)
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });

      // Additionally, try to clear all cookies by iterating through document.cookie
      const cookies = document.cookie.split(';');
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    } catch (err) {
      // Fail silently - removal best-effort only
      // eslint-disable-next-line no-console
      console.warn('clearAuthToken: failed to clear some storages', err);
    }
  };

  // Auto-close modal after 5 seconds if there's a success message (but not for logout messages)
  useEffect(() => {
    let messageTimer;
    // Don't auto-close for success messages that trigger logout confirmation
    if (message && open && !showConfirmModal && !(message.includes('Thank you') || message.includes('unsubscribed'))) {
      messageTimer = setTimeout(() => {
        onClose(); // Close the entire modal after 5 seconds on success (only for non-logout messages)
      }, 5000);
    }
    return () => {
      if (messageTimer) clearTimeout(messageTimer);
    }; // Clean up the timer
  }, [message, open, onClose, showConfirmModal]);

  // Auto-close error after 8 seconds
  useEffect(() => {
    let errorTimer;
    if (error && open) {
      errorTimer = setTimeout(() => {
        setError(''); // Only clear the error, don't close the entire modal
      }, 3000);
    }
    return () => {
      if (errorTimer) clearTimeout(errorTimer);
    }; // Clean up the timer
  }, [error, open]);

  if (!open) return null;

  const handleSubscribe = () => {
    // Show confirmation modal before making the API call
    setPendingAction('subscribe');
    setShowConfirmModal(true);
  };

  const handleUnsubscribe = () => {
    // Show confirmation modal before making the API call
    setPendingAction('unsubscribe');
    setShowConfirmModal(true);
  };

  const handleConfirmLogout = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (pendingAction === 'subscribe') {
        const res = await makeApiRequest('/api/subscribed-monthly-pdf', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail || '',
            name: userName || '',  
            is_active: true
          })
        });

        const data = await res.json();
        if (res.ok) {
          setMessage(data || `Thank you ${userName || ''} for subscribing.`);
          setError(''); // Clear any previous error
          // Show result instead of logging out immediately
          setShowResult(true);
          setShowConfirmModal(false); // Hide confirmation
          // Logout user after successful subscription: clear token from all storages and cookies
          setTimeout(() => {
            clearAuthToken();
            navigate('/'); // Redirect to home page after logout
          }, 1500); // Wait 1.5 seconds before logout to allow message to be seen
        } else {
          setError((data.detail && data.detail.replace(/^\d+:\s*/, '')) || 'Failed to subscribe.');
          setMessage(''); // Clear any previous message
          // Show result with error
          setShowResult(true);
          setShowConfirmModal(false); // Hide confirmation
        }
      } else if (pendingAction === 'unsubscribe') {
        const res = await makeApiRequest('/api/unsubscribed-monthly-pdf', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail || '',
            is_active: false
          })
        });

        const data = await res.json();
        if (res.ok) {
          setMessage(data || 'You have unsubscribed from the monthly report.');
          setError(''); // Clear any previous error
          // Show result instead of logging out immediately
          setShowResult(true);
          setShowConfirmModal(false); // Hide confirmation
          // Logout user after successful unsubscription: clear token from all storages and cookies
          setTimeout(() => {
            clearAuthToken();
            navigate('/'); // Redirect to home page after logout
          }, 1500); // Wait 1.5 seconds before logout to allow message to be seen
        } else {
          setError((data.detail && data.detail.replace(/^\d+:\s*/, '')) || 'Failed to unsubscribe.');
          setMessage(''); // Clear any previous message
          // Show result with error
          setShowResult(true);
          setShowConfirmModal(false); // Hide confirmation
        }
      }
    } catch (err) {
      setError(err.message || 'Network error.');
      setMessage(''); // Clear any previous message
      // Show result with error
      setShowResult(true);
      setShowConfirmModal(false); // Hide confirmation
    } finally {
      setLoading(false);
      // Don't reset pending action here as we need it to show the correct message
    }
  };

  const handleCancelLogout = () => {
    setShowConfirmModal(false);
    setShowResult(false);
    setPendingAction(null);
    setError(''); // Clear any error messages
    setMessage(''); // Clear any message
  };

  return (
    <div className="subscribe-modal-overlay blurred">
      <div className="subscribe-modal" onClick={(e) => e.stopPropagation()}>
        {/* Show different content based on the current state */}
        {showResult ? (
          // Result view after API call
          <>
            <div className="modal-header">
              <div className="pdf-icon" aria-hidden>
                {error ? (
                  // Error icon
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#DC2626"/>
                    <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  // Success icon
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="#16A34A"/>
                    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="subscribe-content">
                <h2>{error ? 'Error' : 'Success'}</h2>
                <p>{error ? 'Something went wrong' : 'Action completed successfully'}</p>
              </div>
            </div>

            <div className="modal-body">
              {error ? (
                <div className="alert error">
                  <div className="alert-content">{error}</div>
                </div>
              ) : message ? (
                <div className="alert success">
                  <div className="alert-content">{message}</div>
                </div>
              ) : null}
              
              <div className="modal-footer">
                <small>You will be redirected shortly...</small>
              </div>
            </div>
          </>
        ) : showConfirmModal ? (
          // Confirmation view
          <>
            <div className="modal-header">
              <div className="pdf-icon" aria-hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2H14L20 8V22C20 22.5523 19.5523 23 19 23H6C5.44772 23 5 22.5523 5 22V3C5 2.44772 5.44772 2 6 2Z" fill="#E53935"/>
                  <path d="M14 2V8H20" fill="#FFCDD2"/>
                  <path d="M9 15H15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12H15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 18H12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="subscribe-content">
                <h2>Confirm Action</h2>
                <p>By {pendingAction === 'subscribe' ? 'subscribing' : 'unsubscribing'}, you will be logged out of your account.</p>
              </div>
              <button className="modal-close" onClick={handleCancelLogout} disabled={loading}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p>Do you want to proceed?</p>
              <div className="form-actions">
                <button className="btn btn-outline" onClick={handleCancelLogout} disabled={loading}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleConfirmLogout} disabled={loading}>
                  Proceed
                </button>
              </div>
              
              <div className="modal-footer">
                <small>You will need to log back in after this action.</small>
              </div>
            </div>
          </>
        ) : (
          // Main subscription view
          <>
            <div className="modal-header">
              <div className="pdf-icon" aria-hidden>
                {/* Simple inline SVG for PDF icon */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2H14L20 8V22C20 22.5523 19.5523 23 19 23H6C5.44772 23 5 22.5523 5 22V3C5 2.44772 5.44772 2 6 2Z" fill="#E53935"/>
                  <path d="M14 2V8H20" fill="#FFCDD2"/>
                  <path d="M9 15H15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12H15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 18H12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="subscribe-content">
                <h2>Monthly PDF Report</h2>
                <p>Subscribe to get a monthly PDF summary of your transactions sent to your email.</p>
              </div>
              <button className="modal-close" onClick={onClose} disabled={loading}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {message && (
                <div className="alert success">
                  <div className="alert-content">{message}</div>
                  <button className="alert-close" onClick={() => setMessage('')}>×</button>
                </div>
              )}
              {error && (
                <div className="alert error">
                  <div className="alert-content">{error}</div>
                  <button className="alert-close" onClick={() => setError('')}>×</button>
                </div>
              )}

              <div className="form-actions">
                {userSubscriberStatus ? (
                  <button className="btn btn-outline" onClick={handleUnsubscribe} disabled={loading}>
                    {loading ? 'Processing...' : 'Unsubscribe'}
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleSubscribe} disabled={loading}>
                    {loading ? 'Processing...' : 'Subscribe'}
                  </button>
                )}
              </div>
              
              <div className="modal-footer">
                <small>You'll receive the monthly PDF to the email associated with your account.</small>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribeMonthlyModal;