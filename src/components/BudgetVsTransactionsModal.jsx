import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BudgetVsTransactionsModal.css';

const BudgetVsTransactionsModal = ({ isOpen, onClose, budgetData }) => {
  useEffect(() => {
    if (isOpen) {
      // Add blur class to body when modal opens
      document.body.classList.add('modal-open');
    } else {
      // Remove blur class from body when modal closes
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate percentage for each item
  const budgetDataWithPercentage = budgetData.map(item => ({
    ...item,
    percentageUsed: item.budget_limit_amount > 0 
      ? ((item.spent_amount / item.budget_limit_amount) * 100).toFixed(1) 
      : 0
  }));

  // Sort by percentage used in descending order
  const sortedBudgetData = [...budgetDataWithPercentage].sort((a, b) => b.percentageUsed - a.percentageUsed);

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Budget vs Transactions</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {sortedBudgetData.length > 0 ? (
            <div className="budget-list">
              {sortedBudgetData.map((item, index) => {
                const percentageUsed = parseFloat(item.percentageUsed);
                let statusColor = '#28a745'; // Green for good
                if (percentageUsed >= 90) {
                  statusColor = '#dc3545'; // Red for almost exceeded
                } else if (percentageUsed >= 75) {
                  statusColor = '#ffc107'; // Yellow for approaching limit
                }
                
                return (
                  <div key={index} className="budget-item">
                    <div className="budget-item-header">
                      <span className="budget-category">{item.category_name}</span>
                      <span className="budget-percentage" style={{ color: statusColor }}>
                        {percentageUsed}%
                      </span>
                    </div>
                    
                    <div className="budget-details">
                      <div className="budget-limit">
                        <span className="detail-label">Budget:</span>
                        <span className="detail-value">PKR {item.budget_limit_amount.toFixed(2)}</span>
                      </div>
                      
                      <div className="budget-spent">
                        <span className="detail-label">Spent:</span>
                        <span className="detail-value">PKR {item.spent_amount.toFixed(2)}</span>
                      </div>
                      
                      <div className="budget-remaining">
                        <span className="detail-label">Remaining:</span>
                        <span className="detail-value">PKR {(item.budget_limit_amount - item.spent_amount).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="budget-progress-bar">
                      <div 
                        className="budget-progress" 
                        style={{ 
                          width: `${Math.min(percentageUsed, 100)}%`,
                          backgroundColor: statusColor
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No budget data available</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render the modal to the body to avoid being affected by parent styling
  return createPortal(modalContent, document.body);
};

export default BudgetVsTransactionsModal;