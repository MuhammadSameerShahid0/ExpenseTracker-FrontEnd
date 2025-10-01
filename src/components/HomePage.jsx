import React from 'react'
import Navbar from './Navbar'
import './HomePage.css'

const HomePage = () => {

  const features = [
    {
      title: "Expense Tracking",
      description: "Monitor your daily expenses and spending patterns",
      icon: "💰"
    },
    {
      title: "Budget Management",
      description: "Create and manage budgets with spending limits",
      icon: "📊"
    },
    {
      title: "Financial Reports",
      description: "Get insights with detailed financial reports",
      icon: "📈"
    }
  ]

  const steps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your account in seconds.",
      icon: "📝"
    },
    {
      step: "2",
      title: "Add Your Expenses",
      description: "Input your expenses with our simple form.",
      icon: "➕"
    },
    {
      step: "3",
      title: "Track & Analyze",
      description: "View your spending patterns and save more.",
      icon: "🔍"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelancer",
      content: "ExpenseTracker helped me cut unnecessary expenses by 30% and save more effectively.",
      avatar: "👩"
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      content: "The budget tracking features have revolutionized how I manage my business finances.",
      avatar: "👨"
    },
    {
      name: "Emma Rodriguez",
      role: "College Student",
      content: "Budgeting as a student became easy with this app. I now save $200+ monthly.",
      avatar: "👩‍🎓"
    }
  ]

  const expenseCategories = [
    {
      name: "Food & Dining",
      icon: "🍽️",
      avg: "25%"
    },
    {
      name: "Transportation",
      icon: "🚗",
      avg: "15%"
    },
    {
      name: "Housing",
      icon: "🏠",
      avg: "35%"
    },
    {
      name: "Entertainment",
      icon: "🎬",
      avg: "10%"
    }
  ]

  const footerLinks = {
    platform: ["Dashboard", "Add Expense", "Reports", "Budgets"],
    company: ["About Us", "Features", "Contact", "Blog"]
  }

  return (
    <div className="homepage" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <div className="hero-content">
              <div className="hero-badge">
                <span>💰 Track Your Expenses, Save More Money</span>
              </div>
              <h1 className="hero-title">Take Control of Your Finances with ExpenseTracker</h1>
              <p className="hero-subtitle">
                Simple expense tracking, smart budgeting, and detailed financial insights. 
                Start managing your money better today.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat">
                  <div className="stat-number">85%</div>
                  <div className="stat-label">Savings Increase</div>
                </div>
                <div className="stat">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Secure Access</div>
                </div>
              </div>
              <div className="hero-buttons">
                <a href="/register" className="btn btn-primary btn-large">Start Tracking Free</a>
                <a href="/login" className="btn btn-outline btn-large">Login to Account</a>
              </div>
            </div>
            <div className="hero-image">
              <div className="iphone-mockup">
                <div className="iphone-frame">
                  <div className="silent-switch"></div>
                  <div className="volume-buttons"></div>
                  <div className="iphone-screen">
                    <div className="iphone-notch"></div>
                    <div className="app-dashboard">
                      <div className="app-header">
                        <div className="app-title">ExpenseTracker</div>
                        <div className="app-balance">$1,245.75</div>
                      </div>
                      <div className="app-nav">
                        <div className="nav-item active">Dashboard</div>
                        <div className="nav-item">Expenses</div>
                        <div className="nav-item">Budgets</div>
                        <div className="nav-item">Reports</div>
                      </div>
                      <div className="expense-summary">
                        <div className="expense-item">
                          <div className="expense-icon">🍔</div>
                          <div className="expense-info">
                            <div className="expense-name">Lunch</div>
                            <div className="expense-category">Food</div>
                          </div>
                          <div className="expense-amount">-$12.50</div>
                        </div>
                        <div className="expense-item">
                          <div className="expense-icon">🚗</div>
                          <div className="expense-info">
                            <div className="expense-name">Gas</div>
                            <div className="expense-category">Transport</div>
                          </div>
                          <div className="expense-amount">-$45.00</div>
                        </div>
                        <div className="expense-item">
                          <div className="expense-icon">🎬</div>
                          <div className="expense-info">
                            <div className="expense-name">Movie</div>
                            <div className="expense-category">Entertainment</div>
                          </div>
                          <div className="expense-amount">-$18.99</div>
                        </div>
                      </div>
                      <div className="expense-chart">
                        <div className="chart-title">Spending This Month</div>
                        <div className="chart-container">
                          <div className="chart-bar" style={{height: '30%'}} title="Food: $150">
                            <div className="bar-label">Food</div>
                          </div>
                          <div className="chart-bar" style={{height: '45%'}} title="Transport: $225">
                            <div className="bar-label">Trans</div>
                          </div>
                          <div className="chart-bar" style={{height: '60%'}} title="Entertainment: $300">
                            <div className="bar-label">Ent</div>
                          </div>
                          <div className="chart-bar" style={{height: '80%'}} title="Housing: $400">
                            <div className="bar-label">Hous</div>
                          </div>
                          <div className="chart-bar" style={{height: '65%'}} title="Utilities: $325">
                            <div className="bar-label">Util</div>
                          </div>
                        </div>
                      </div>
                      <div className="quick-actions">
                        <div className="action-btn">+ Add Expense</div>
                        <div className="action-btn">View All</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expense Categories */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Common Expense Categories</h2>
            <p>Track and manage your spending across different areas</p>
          </div>
          <div className="categories-grid">
            {expenseCategories.map((category, index) => (
              <div className="category-card" key={index}>
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <div className="category-details">
                  <div className="avg-spending">
                    <span className="label">Avg:</span>
                    <span className="value">{category.avg}</span>
                  </div>
                </div>
                <button className="btn-track">Track Expense</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Financial Tools</h2>
            <p>Everything you need to manage your expenses effectively</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-cta">
                  <span>Learn More →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Start Managing Your Expenses in 3 Steps</h2>
            <p>Simple, secure, and designed for everyone</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div className="step-card" key={index}>
                <div className="step-header">
                  <div className="step-number">{step.step}</div>
                  <div className="step-icon">{step.icon}</div>
                </div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories from Our Users</h2>
            <p>Join thousands of users taking control of their finances</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security">
        <div className="container">
          <div className="security-card">
            <div className="security-content">
              <div className="security-text">
                <h2>Bank-Grade Security & Protection</h2>
                <p>
                  Your financial data is protected with institutional-grade security measures, including 
                  military-grade encryption, multi-factor authentication, and secure cloud storage.
                </p>
                <div className="security-features">
                  <div className="security-feature">
                    <span className="security-icon">🔒</span>
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="security-feature">
                    <span className="security-icon">🛡️</span>
                    <span>Private Data Storage</span>
                  </div>
                  <div className="security-feature">
                    <span className="security-icon">📱</span>
                    <span>Biometric Authentication</span>
                  </div>
                  <div className="security-featusre">
                    
                  </div>
                </div>
              </div>
              <div className="security-image">
                <div className="security-badge">
                  <div className="badge-icon">🛡️</div>
                  <div className="badge-text">Enterprise Security</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" style={{marginTop: 'auto'}}>
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-brand">
                <h3>ExpenseTracker</h3>
                <p>Smart expense management for everyone. Take control of your finances with confidence.</p>
                <div className="footer-social">
                  <a href="#" aria-label="Twitter">🐦</a>
                  <a href="#" aria-label="Facebook">📘</a>
                  <a href="#" aria-label="Instagram">📸</a>
                  <a href="#" aria-label="LinkedIn">💼</a>
                </div>
              </div>
              
              <div className="footer-links">
                <div className="footer-column">
                  <h4>What will you see</h4>
                  <ul>
                    {footerLinks.platform.map((link, index) => (
                      <li key={index}><a href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
                 <div className="footer-column">
                  <h4>Company</h4>
                  <ul>
                    {footerLinks.company.map((link, index) => (
                      <li key={index}><a href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
                <div className="footer-column">
                  <h4>Download App</h4>
                  <div className="app-download-buttons">
                <a href="#" className="download-btn app-store">
                  <span className="store-icon">📱</span>
                  <div className="store-text">
                    <span>Download on the</span>
                    <span>App Store</span>
                  </div>
                </a>
                <a href="#" className="download-btn google-play">
                  <span className="store-icon">🤖</span>
                  <div className="store-text">
                    <span>Get it on</span>
                    <span>Google Play</span>
                  </div>
                </a>
              </div>
                </div>
               
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
              <div className="footer-legal">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage