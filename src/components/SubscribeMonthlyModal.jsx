import React, { useState, useEffect } from 'react';
import './SubscribeMonthlyModal.css';
import { makeApiRequest } from '../utils/api';

const SubscribeMonthlyModal = ({ open, onClose, userName, userEmail, userSubscriberStatus }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auto-close modal after 8 seconds if there's a success message
  useEffect(() => {
    let messageTimer;
    if (message && open) {
      messageTimer = setTimeout(() => {
        onClose(); // Close the entire modal after 8 seconds on success
      }, 3000);
    }
    return () => {
      if (messageTimer) clearTimeout(messageTimer);
    }; // Clean up the timer
  }, [message, open, onClose]);

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

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
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
      } else {
        setError((data.detail && data.detail.replace(/^\d+:\s*/, '')) || 'Failed to subscribe.');      }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
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
        } 
        else 
        {
            setError((data.detail && data.detail.replace(/^\d+:\s*/, '')) || 'Failed to unsubscribe.');      
        }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-modal-overlay blurred">
      <div className="subscribe-modal" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  );
};

export default SubscribeMonthlyModal;