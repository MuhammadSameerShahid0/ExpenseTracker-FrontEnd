import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { handleGoogleCallback } from '../utils/GoogleAuth';
import Navbar from '../Navbar';
import { makeApiRequest, getApiBaseUrl } from '../../utils/api';
import './Auth.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: login form, 2: verification, 3: reactivation
  const [verificationData, setVerificationData] = useState({
    emailCode: '',
    totp: ''
  });
  const [reactivationData, setReactivationData] = useState({
    email: '',
    code: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();
  
  // Handle Google OAuth callback
  useEffect(() => {
    const googleAuthResult = handleGoogleCallback(location);
    if (googleAuthResult) {
      // Check if there's an error in the callback
      if (googleAuthResult.error) {
        setError(googleAuthResult.error_description || 'An error occurred during Google authentication. Please try again.');
        return;
      }
      
      // Extract user info from token
      const token = googleAuthResult.access_token;
      
      // Try to verify the token and get user info using the auth context
      const verifyTokenAndLogin = async () => {
        try {
          const response = await makeApiRequest('/api/verify-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            // Use the auth context to set the user and token
            login(data.user, token);
            sessionStorage.setItem('justLoggedIn', 'true'); // Set flag for modal
            // Navigate to dashboard after successful Google login
            navigate('/dashboard');
          } else {
            // Fallback user object if we can't get user info from token
            const fallbackUser = {
              email: 'google_user@example.com', // This would come from the token
              username: 'Google User' // This would come from the token
            };
            login(fallbackUser, token);
            // Navigate to dashboard after successful Google login
            navigate('/dashboard');
          }
        } catch (error) {
          setError('An error occurred during Google login. Please try again.');
        }
      };
      
      verifyTokenAndLogin();
    }
  }, [location, login, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleVerificationChange = (e) => {
    setVerificationData({
      ...verificationData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleReactivationChange = (e) => {
    setReactivationData({
      ...reactivationData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await makeApiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Check if we received a token directly (2FA disabled) or a message (2FA enabled)
        if (data.access_token) {
          // 2FA is disabled, we received a token directly
          login({ email: formData.email, username: data.username }, data.access_token);
          sessionStorage.setItem('justLoggedIn', 'true'); // Set flag for modal
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          // 2FA is enabled, move to verification step
          setStep(2); // Move to verification step
        }
      } else {
        // Check if the error is related to an inactive account
        if (data.detail && data.detail.includes('Account not active')) {
          // Set the email for reactivation and move to reactivation step
          setReactivationData(prev => ({ ...prev, email: formData.email }));
          setStep(3);
        } else {
          setError(data.detail || 'Login failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await makeApiRequest(`/api/LoginVerificationEmailCodeAnd2FAOtp?code=${verificationData.emailCode}&otp=${verificationData.totp}`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Extract user info from session or use email from login form
        const user = {
          email: formData.email,
          username: data.username || 'User'
        };
        
        // Use the auth context to set the user and token
        login(user, data.access_token);
        sessionStorage.setItem('justLoggedIn', 'true'); // Set flag for modal
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setError(data.detail || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivationRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email is present
    if (!reactivationData.email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await makeApiRequest(`/api/re-active-account?email=${encodeURIComponent(reactivationData.email)}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully requested reactivation, keep user on this step to enter code
        setError('Reactivation code sent to your email. Please check your inbox.');
      } else {
        setError(data.detail || 'Failed to request account reactivation');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate code is present
    if (!reactivationData.code) {
      setError('Please enter the verification code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await makeApiRequest(`/api/re-active-account-verification-email-code?code=${reactivationData.code}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        // Account successfully reactivated, move back to login
        setError('Account successfully reactivated! Please log in again.');
        setStep(1);
        // Clear form data
        setFormData({ email: reactivationData.email, password: '' });
      } else {
        setError(data.detail || 'Failed to reactivate account');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    if (credentialResponse.credential) {
      // The credential is a JWT token, we can send it to our backend for verification
      setIsLoading(true);
      setError('');
      
      try {
        const response = await makeApiRequest(`/api/google_oauth_cred?code=${credentialResponse.credential}`, {
          method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
          // Check if we received a token directly (2FA disabled) or a message (2FA enabled)
          if (data.access_token) {
            // 2FA is disabled, we received a token directly
            login({ email: data.email, username: data.username }, data.access_token);
            sessionStorage.setItem('justLoggedIn', 'true'); // Set flag for modal
            navigate('/dashboard'); // Redirect to dashboard
          } else {
            // 2FA is enabled, move to verification step
            setStep(2); // Move to verification step
          }
        } else {
          // Show the original error from the API
          if (data.detail && typeof data.detail === 'object' && data.detail.message) {
            // Handle case where detail contains a message property
            if (data.detail.message.includes('Account not active')) {
              // Set the email for reactivation and move to reactivation step
              setReactivationData(prev => ({ ...prev, email: data.detail.email || formData.email }));
              setStep(3);
            } else {
              setError(data.detail.message || 'Login failed');
            }
          } else if (data.detail) {
            // Handle case where detail is a string or other direct error message
            setError(data.detail);
          } else {
            // Fallback for other error formats
            setError(data.message || data.error || 'Login failed');
          }
        }
      } catch (err) {
        // Show the actual error that occurred during the API call
        setError(err.message || 'An error occurred during Google login. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLoginError = async () => {
    setError('Google login was unsuccessful. Please try again.');
  }

  return (
    <div className="auth-container">
      <Navbar />
      <div className="auth-card">
        <div className="auth-header">
          <h2>
            {step === 1 ? 'Welcome Back' : 
             step === 2 ? 'Two-Factor Authentication' : 
             'Account Reactivation'}
          </h2>
          <p>
            {step === 1 ? 'Sign in to your account' : 
             step === 2 ? 'Enter verification codes' : 
             'Reactivate your account to continue'}
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Divider with "or" text */}
            <div className="divider-or">
              <span>or</span>
            </div>
            
            {/* Google Login Button */}
             <div className="google-login-wrapper">
            <GoogleLogin
             onSuccess={handleGoogleLogin}
             onError={handleGoogleLoginError}
            />
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
              <p>
                <Link to="/reactivate-account">Reactivate your account</Link>
              </p>
            </div>
          </form>
        ) : step === 2 ? (
          <div className="auth-form-container">
            <form onSubmit={handleVerificationSubmit} className="auth-form verification-form">
           
              <div className="form-group">
                <label htmlFor="emailCode">Email Verification Code</label>
                <input
                  type="text"
                  id="emailCode"
                  name="emailCode"
                  value={verificationData.emailCode}
                  onChange={handleVerificationChange}
                  required
                  maxLength="6"
                  disabled={isLoading}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div className="form-group">
                <label htmlFor="totp">Authenticator App Code</label>
                <input
                  type="text"
                  id="totp"
                  name="totp"
                  value={verificationData.totp}
                  onChange={handleVerificationChange}
                  required
                  maxLength="6"
                  disabled={isLoading}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify and Sign In'}
              </button>

              <div className="auth-footer">
                <button 
                  type="button" 
                  className="btn btn-link"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Reactivation form
          <div className="auth-form-container">
            <form onSubmit={handleReactivationSubmit} className="auth-form verification-form">
              <div className="reactivation-info">
                <p>Your account has been deactivated. To reactivate it, we'll send a verification code to your email.</p>
              </div>

              <div className="form-group">
                <label htmlFor="reactivationEmail">Email Address</label>
                <input
                  type="email"
                  id="reactivationEmail"
                  name="email"
                  value={reactivationData.email}
                  onChange={handleReactivationChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <button 
                type="button" 
                className="btn btn-secondary btn-block"
                onClick={handleReactivationRequest}
                disabled={isLoading}
              >
                {isLoading ? 'Sending Code...' : 'Send Reactivation Code'}
              </button>

              <div className="form-group">
                <label htmlFor="reactivationCode">Verification Code</label>
                <input
                  type="text"
                  id="reactivationCode"
                  name="code"
                  value={reactivationData.code}
                  onChange={handleReactivationChange}
                  required
                  maxLength="6"
                  disabled={isLoading}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Reactivating...' : 'Reactivate Account'}
              </button>

              <div className="auth-footer">
                <button 
                  type="button" 
                  className="btn btn-link"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
