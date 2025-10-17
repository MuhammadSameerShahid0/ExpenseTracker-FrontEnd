# Expense Tracker

A comprehensive expense tracking application built with React and Vite. This application allows users to manage their personal finances by tracking expenses, setting budgets, generating reports, and managing their account settings.

## 🚀 Features

- **User Authentication**: Secure login and registration system with Google OAuth support
- **Two-Factor Authentication (2FA)**: Enhanced security with email verification and authenticator app codes
- **Account Reactivation**: Reactivate deactivated accounts with email verification
- **Expense Management**: Add, view, and categorize expenses with custom categories and payment methods
- **Budget Tracking**: Set and monitor spending limits by category with monthly budget controls, editing, and deletion capabilities
- **Advanced Dashboard**: Financial insights with spending trends, budget utilization, and expense distribution charts
- **Detailed Reports**: Generate expense reports with filtering options and PDF export
- **Responsive Design**: Works seamlessly across devices with collapsible sidebar
- **Account Management**: User profile and account settings

## 📋 Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Environment Setup](#environment-setup)
- [Features](#features-1)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173) to view the application

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run preview` - Locally preview the production build
- `npm run lint` - Checks code for linting errors

## Dependencies

### Core Dependencies

- **React**: JavaScript library for building user interfaces
- **React DOM**: React package for DOM-specific methods
- **React Router DOM**: Declarative routing for React
- **@react-oauth/google**: Google OAuth integration for React applications
- **jsPDF**: Client-side JavaScript PDF generation
- **jsPDF Autotable**: Plugin for jsPDF to create tables

### Development Dependencies

- **Vite**: Next generation frontend build tool
- **@vitejs/plugin-react**: Official React plugin for Vite
- **ESLint**: JavaScript linter
- **@types/react**: TypeScript definitions for React
- **@types/react-dom**: TypeScript definitions for React DOM

## Features

### Authentication

- User registration with validation
- Secure login system with JWT tokens
- Google OAuth integration for social login
- Two-Factor Authentication (2FA) with email verification and authenticator app codes
- Account reactivation process for deactivated accounts
- Profile management and account settings

### Expense Management

- Add new expenses with description, category, amount, date, and payment method
- View and filter expenses by various criteria
- Categorize expenses for better tracking (including ability to add custom categories)
- Custom payment methods (Cash, Credit Card, Debit Card, Jazzcash, Easypaisa, Sadapay, Nayapay, with ability to add custom methods)
- Expense tips and best practices section in the Add Expense form

### Budget Tracking

- Set monthly budgets by category
- Track spending against budget limits
- Visual indicators for budget status (progress bars and color coding)
- View and manage multiple budgets with month selection
- Budget utilization analytics and spending insights
- Edit or delete existing budgets
- Financial health indicators based on budget utilization

### Dashboard

- Financial insights with spending trends
- Expense distribution pie charts showing spending by category
- Monthly budget utilization progress bars
- Financial health indicators with recommendations
- Budget vs transaction comparison
- Latest transactions preview
- Savings projection calculations

### Reporting

- Generate detailed expense reports with multiple filtering options
- Filter reports by date range, category, payment method, and amount
- Export reports to PDF format with comprehensive data
- Preview reports in browser before downloading
- Summary statistics for filtered expenses
- Responsive table view of all transaction details

### Responsive Design

- Mobile-first responsive design
- Collapsible sidebar for desktop users
- Mobile-friendly navigation with toggle functionality
- Touch-friendly interface
- Adaptive layouts for different screen sizes

## API Integration

The application connects to a backend API with the following configuration:

- **Development**: Proxied to `http://localhost:8000` via Vite
- **Production**: Deployed to `https://expense-tracker-python-fast-api.vercel.app`

The Vite configuration includes proxy settings for API requests during development.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
