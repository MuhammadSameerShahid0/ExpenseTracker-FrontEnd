import React from 'react';
import './TermsModal.css';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-service-overlay" onClick={onClose}>
      <div className="terms-service-modal" onClick={(e) => e.stopPropagation()}>
        <div className="terms-service-header">
          <h2>Terms of Service</h2>
          <button className="terms-service-close" onClick={onClose}>×</button>
        </div>
        <div className="terms-service-content">
          <p><strong>Effective Date:</strong> October 1, 2025</p>
          
          <h3>Acceptance of Terms</h3>
          <p>By accessing and using ExpenseTracker, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, you are not authorized to use or access this site.</p>
          
          <h3>Use License</h3>
          <p>Permission is granted to temporarily download one copy of the materials on ExpenseTracker's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose, or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on ExpenseTracker's website</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          
          <h3>Disclaimer</h3>
          <p>The materials on ExpenseTracker's website are provided on an 'as is' basis. ExpenseTracker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          
          <h3>Limitations</h3>
          <p>In no event shall ExpenseTracker or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ExpenseTracker's website, even if ExpenseTracker or a ExpenseTracker authorized representative has been notified orally or in writing of the possibility of such damage.</p>
          
          <h3>Accuracy of Materials</h3>
          <p>The materials appearing on ExpenseTracker's website could include technical, typographical, or photographic errors. ExpenseTracker does not warrant that any of the materials on its website are accurate, complete or current. ExpenseTracker may make changes to the materials contained on its website at any time without notice.</p>
          
          <h3>Links</h3>
          <p>ExpenseTracker has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ExpenseTracker of the site. Use of any such linked website is at the user's own risk.</p>
          
          <h3>Modifications</h3>
          <p>ExpenseTracker may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
          
          <h3>Governing Law</h3>
          <p>These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
        </div>
        <div className="terms-service-footer">
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;