import React, { useState } from 'react';
import { makeApiRequest } from '../utils/api';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const [formMessage, setFormMessage] = useState(''); // Store the message from the endpoint

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormMessage(''); // Clear previous messages
    
    try {
      const response = await makeApiRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          subject: formData.subject,
          message: formData.message
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormStatus('success');
        setFormMessage(data.message || 'Your message has been sent successfully!');
        setFormData({
          name: '',
          subject: '',
          message: ''
        });
      } else {
          let errorMessage = data.message || data.detail || data.error || 'Failed to send your message. Please try again.';
          if (typeof errorMessage === 'string' && errorMessage.includes(':')) {
              // Take everything after the first colon and trim spaces
              errorMessage = errorMessage.split(':').slice(1).join(':').trim();
            }
            setFormStatus('error');
          setFormMessage(errorMessage);
      }
    } catch (error) {
      setFormStatus('error');
      // Ensure we don't show technical error details like status codes
      const errorMessage = error.message.includes('CORS') 
        ? 'Unable to connect to the server. Please check your network connection.' 
        : 'An error occurred while sending your message. Please try again.';
      setFormMessage(errorMessage);
    }
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus('idle');
      setFormMessage('');
    }, 5000);
  };

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h2>Contact Us</h2>
          <button className="contact-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="contact-modal-content">
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          
          <form className="contact-modal-form" onSubmit={handleSubmit}>
            <div className="contact-modal-form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
            
            <div className="contact-modal-form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this regarding?"
              />
            </div>
            
            <div className="contact-modal-form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="contact-modal-btn contact-modal-btn-primary"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
            
            {formStatus === 'success' && (
              <div className="contact-modal-form-success">
                {formMessage}
              </div>
            )}
            
            {formStatus === 'error' && (
              <div className="contact-modal-form-error">
                {formMessage}
              </div>
            )}
          </form>
          
          <div className="contact-modal-info">
            <h3>Other Ways to Reach Us</h3>
            <div className="contact-modal-methods">
              <div className="contact-modal-method">
                <span className="contact-modal-icon">📞</span>
                <div className="contact-details">
                  <p className="contact-modal-value">+92316-7394939</p>
                  <p className="contact-modal-description">Mon-Fri from 9am to 5pm EST</p>
                </div>
              </div>
              <div className="contact-modal-method">
                <span className="contact-modal-icon">✉️</span>
                <div className="contact-details">
                  <p className="contact-modal-value">jakehken728@gmail.com</p>
                  <p className="contact-modal-description">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;