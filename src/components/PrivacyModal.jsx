import React from 'react';
import './PrivacyModal.css';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="privacy-policy-overlay" onClick={onClose}>
      <div className="privacy-policy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="privacy-policy-header">
          <h2>Privacy Policy</h2>
          <button className="privacy-policy-close" onClick={onClose}>×</button>
        </div>
        <div className="privacy-policy-content">
          <p><strong>Effective Date:</strong> October 1, 2025</p>
          
          <h3>Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include your name, email address, and financial information you choose to store in our application.</p>
          
          <h3>How We Use Your Information</h3>
          <p>We use information about you to provide and improve our services, including to:</p>
          <ul>
            <li>Provide, maintain, and improve our expense tracking services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Protect the security and integrity of our services</li>
          </ul>
          
          <h3>Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption and secure storage methods for your financial data.</p>
          
          <h3>Sharing Your Information</h3>
          <p>We do not share your personal information with third parties except as described in this policy. We may share information with service providers who assist us in operating our services, conducting business, or serving our users.</p>
          
          <h3>Your Rights</h3>
          <p>You have the right to access, update, or delete your personal information at any time. You may contact us to exercise these rights or if you have questions about our privacy practices.</p>
          
          <h3>Changes to This Policy</h3>
          <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date.</p>
        </div>
        <div className="privacy-policy-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;