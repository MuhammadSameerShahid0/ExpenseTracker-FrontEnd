# Expense Tracker

A comprehensive expense tracking application built with React and Vite. This application allows users to manage their finances by adding expenses, tracking budgets, generating reports, and monitoring their spending habits.

## Features

- **User Authentication**: Secure login and registration system
- **Expense Management**: Add, view, and manage your expenses
- **Budget Tracking**: Set and monitor your monthly budgets
- **Reporting**: Generate detailed reports and visualizations
- **Dashboard**: Overview of spending patterns and financial statistics
- **PDF Export**: Export reports as PDF documents
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
expense-tracker/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AccountReactivation.jsx
│   │   │   ├── AccountSettings.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AuthContext.jsx
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

## Technologies Used

- **React** (v19.1.1)
- **Vite** (v7.1.2) - Next Generation Frontend Tooling
- **React Router DOM** (v7.9.1) - Declarative routing for React
- **React Calendar** (v6.0.0) - Calendar component for date selection
- **jsPDF** (v3.0.3) - PDF generation library
- **jsPDF Autotable** (v5.0.2) - Create PDF tables
- **ESLint** - Linting utility for JavaScript and JSX

## Prerequisites

Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

## Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start the development server. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Building for Production

To create a production build:

```bash
npm run build
```

This command bundles the application for deployment. The built files will be placed in the `dist` directory.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run lint` - Runs ESLint to check for code issues
- `npm run preview` - Locally preview the production build

## Dependencies

### Production Dependencies
- `react`: ^19.1.1
- `react-dom`: ^19.1.1
- `react-router-dom`: ^7.9.1
- `react-calendar`: ^6.0.0
- `jspdf`: ^3.0.3
- `jspdf-autotable`: ^5.0.2

### Development Dependencies
- `@vitejs/plugin-react`: ^5.0.0
- `@eslint/js`: ^9.33.0
- `@types/react`: ^19.1.10
- `@types/react-dom`: ^19.1.7
- `eslint`: ^9.33.0
- `eslint-plugin-react-hooks`: ^5.2.0
- `eslint-plugin-react-refresh`: ^0.4.20
- `globals`: ^16.3.0
- `vite`: ^7.1.2

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
