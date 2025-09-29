# Expense Tracker

A comprehensive expense tracking application built with React and Vite. This application allows users to manage their personal finances by tracking expenses, setting budgets, generating reports, and managing their account settings.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Expense Management**: Add, view, and categorize expenses
- **Budget Tracking**: Set and monitor spending limits
- **Detailed Reports**: Generate expense reports with filtering options and PDF export
- **Responsive Design**: Works seamlessly across devices
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

- [Node.js](https://nodejs.org/) (version 16 or higher)
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

## Project Structure

```
expense-tracker/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AccountReactivation.jsx
│   │   │   ├── AccountSettings.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   ├── AddExpense.jsx
│   │   ├── BudgetModal.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ExpensesList.jsx
│   │   ├── HomePage.jsx
│   │   ├── Navbar.jsx
│   │   ├── Reports.jsx
│   │   └── Sidebar.jsx
│   ├── configs/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Dependencies

### Core Dependencies

- **React**: JavaScript library for building user interfaces
- **React DOM**: React package for DOM-specific methods
- **React Router DOM**: Declarative routing for React
- **React Calendar**: Calendar component for date selection
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
- Secure login system
- Profile management
- Account settings and reactivation

### Expense Management
- Add new expenses with description, category, amount, and payment method
- View and filter expenses by various criteria
- Categorize expenses for better tracking

### Budget Tracking
- Set monthly budgets
- Track spending against budget limits
- Visual indicators for budget status

### Reporting
- Generate detailed expense reports
- Filter reports by date range, category, payment method, and amount
- Export reports to PDF format
- View report summaries with totals and transaction counts

### Responsive Design
- Mobile-first responsive design
- Adapts to different screen sizes
- Touch-friendly interface

## API Integration

The application connects to a backend API with the following base URLs:

- **Development**: `http://localhost:8000`
- **Production**: `https://expense-tracker-fast-api.vercel.app`

The application automatically detects the environment and uses the appropriate API endpoint.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.