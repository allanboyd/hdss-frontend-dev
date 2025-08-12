# A-SEARCH: African Search Engine for Community Health Research

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

A-SEARCH is a comprehensive health research data management platform designed for African research sites. The platform enables field agents, researchers, and policymakers to collect, access, and analyze population and health data across research sites with ease and clarity.

### Key Objectives

- **Data Collection**: Streamlined data collection from multiple research sites
- **Data Analysis**: Advanced analytics and visualization tools
- **User Management**: Role-based access control for different stakeholders
- **Geographic Management**: Hierarchical site, village, and structure management
- **Real-time Collaboration**: Live data updates and collaborative features

## ✨ Features

### 🔐 Authentication & Authorization

- Secure user authentication with Supabase Auth
- Role-based access control (Admin, Site Manager, Field Agent, Researcher)
- Multi-factor authentication support
- Session management and token refresh

### 📊 Data Management

- **Geographic Hierarchy**: Countries → Sites → Villages → Structures → Dwelling Units
- **User Management**: Profile management, role assignment, site assignment
- **Request System**: Account request workflow with approval/rejection
- **Data Validation**: Input validation and data integrity checks

### 📈 Analytics & Reporting

- Interactive dashboards with real-time data
- Geographic data visualization
- Health analytics and population reports
- Export capabilities for research data

### 🗺️ Geographic Features

- Site management with GPS coordinates
- Village and structure mapping
- Dwelling unit tracking
- Geographic data visualization

### 📧 Communication

- Automated email notifications
- Welcome emails for new users
- Request status notifications
- System alerts and announcements

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.0
- **UI Components**: shadcn/ui
- **State Management**: React Context + Hooks
- **Icons**: Lucide React

### Backend & Database

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **API**: RESTful services with TypeScript

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Testing**: Jest + React Testing Library
- **Version Control**: Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/a-search-app.git
   cd a-search-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**

   ```bash
   # Run database migrations
   npm run db:migrate

   # Seed initial data
   npm run db:seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
a-search-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── dashboard/                # Dashboard pages
│   ├── api/                      # API routes
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── user-management/         # User management components
│   └── site-management/         # Site management components
├── lib/                         # Utility libraries
│   ├── auth/                    # Authentication utilities
│   ├── database/                # Database services
│   ├── utils/                   # General utilities
│   └── types/                   # TypeScript type definitions
├── hooks/                       # Custom React hooks
├── types/                       # TypeScript interfaces
├── public/                      # Static assets
├── tests/                       # Test files
└── docs/                        # Documentation
```

## 📝 Development Guidelines

### Code Style

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Component Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines (WCAG 2.1)
- Write unit tests for critical components

### Database Guidelines

- Use Row Level Security (RLS) policies
- Implement proper data validation
- Follow naming conventions
- Document database schema changes

### Security Guidelines

- Validate all user inputs
- Implement proper authentication checks
- Use environment variables for sensitive data
- Regular security audits

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier

# Type Checking
npm run type-check   # Run TypeScript type checking
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Password reset

### User Management

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Site Management

- `GET /api/sites` - Get all sites
- `POST /api/sites` - Create new site
- `PUT /api/sites/:id` - Update site
- `DELETE /api/sites/:id` - Delete site

For detailed API documentation, see [API.md](./docs/API.md)

## 🚀 Deployment

### Production Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Docker container

### Environment Variables

Ensure all required environment variables are set in production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting a pull request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Process

- All code must be reviewed before merging
- Tests must pass
- Code must follow style guidelines
- Documentation must be updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the [FAQ](./docs/FAQ.md)

---

**A-SEARCH** - Empowering health research across Africa 🌍
