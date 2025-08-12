# Frequently Asked Questions (FAQ)

## 📋 Table of Contents

- [General Questions](#general-questions)
- [Authentication & Security](#authentication--security)
- [Data Management](#data-management)
- [Technical Issues](#technical-issues)
- [Development](#development)
- [Deployment](#deployment)

## 🤔 General Questions

### What is A-SEARCH?

A-SEARCH (African Search Engine for Community Health Research) is a comprehensive health research data management platform designed for African research sites. It enables field agents, researchers, and policymakers to collect, access, and analyze population and health data across research sites.

### Who can use A-SEARCH?

A-SEARCH is designed for:

- **Field Agents**: Data collection and entry
- **Site Managers**: Managing specific research sites
- **Researchers**: Data analysis and reporting
- **System Administrators**: Full system management
- **Policymakers**: Access to aggregated data and reports

### What countries does A-SEARCH support?

A-SEARCH currently supports research sites in:

- Kenya
- Uganda
- Tanzania
- Ethiopia
- Ghana
- Nigeria
- South Africa
- Rwanda
- Malawi
- Zambia

More countries can be added as needed.

### Is A-SEARCH free to use?

A-SEARCH is an open-source platform. The software itself is free, but hosting and infrastructure costs may apply depending on your deployment setup.

## 🔐 Authentication & Security

### How do I create an account?

1. Visit the account request page
2. Fill out the registration form with your details
3. Submit your request
4. Wait for approval from a system administrator
5. You'll receive an email with login credentials

### I forgot my password. How do I reset it?

1. Go to the login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email for reset instructions
5. Follow the link to create a new password

### How secure is my data?

A-SEARCH implements multiple security measures:

- **Row Level Security (RLS)**: Database-level access control
- **Encrypted Data**: All sensitive data is encrypted
- **Secure Authentication**: JWT tokens with refresh mechanism
- **Input Validation**: All user inputs are validated
- **HTTPS**: All communications are encrypted

### Can I change my role or site assignment?

Role and site assignments can only be changed by system administrators. Contact your administrator if you need changes to your account.

### What happens if I'm inactive for too long?

Sessions automatically expire after 1 hour of inactivity. You'll be redirected to the login page and need to sign in again.

## 📊 Data Management

### What types of data can I collect?

A-SEARCH supports various data types:

- **Demographic Data**: Age, gender, location
- **Health Data**: Medical conditions, treatments
- **Geographic Data**: GPS coordinates, addresses
- **Survey Data**: Custom questionnaires
- **Document Data**: Reports, images, files

### How is data organized?

Data follows a hierarchical structure:

```
Country
└── Site
    └── Village
        └── Structure
            └── Dwelling Unit
```

### Can I export my data?

Yes, data can be exported in various formats:

- CSV for spreadsheet analysis
- JSON for API integration
- PDF for reports
- Excel for detailed analysis

### How is data backed up?

- **Automatic Backups**: Daily automated backups
- **Real-time Replication**: Data is replicated across multiple servers
- **Point-in-time Recovery**: Restore data to any point in time
- **Off-site Storage**: Backups stored in multiple locations

### Can I delete data?

Data deletion is restricted based on your role:

- **Field Agents**: Can only delete their own recent entries
- **Site Managers**: Can delete data within their site
- **System Administrators**: Can delete any data

## 🛠️ Technical Issues

### The application is slow. What can I do?

1. **Check your internet connection**
2. **Clear browser cache and cookies**
3. **Try a different browser**
4. **Contact support if the issue persists**

### I'm getting an error message. What should I do?

1. **Note the exact error message**
2. **Check if you have the required permissions**
3. **Try refreshing the page**
4. **Contact support with the error details**

### The map isn't loading properly.

1. **Check your internet connection**
2. **Ensure JavaScript is enabled**
3. **Try a different browser**
4. **Contact support if the issue persists**

### I can't upload files.

1. **Check file size** (max 10MB per file)
2. **Check file type** (supported: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG)
3. **Check your internet connection**
4. **Contact support if the issue persists**

## 💻 Development

### How do I contribute to A-SEARCH?

1. **Fork the repository** on GitHub
2. **Create a feature branch**
3. **Make your changes**
4. **Write tests** for new functionality
5. **Submit a pull request**

### What technologies does A-SEARCH use?

**Frontend:**

- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- shadcn/ui components

**Backend:**

- Supabase (PostgreSQL database)
- Supabase Auth
- Real-time subscriptions

**Development:**

- ESLint for code quality
- Prettier for formatting
- Jest for testing
- Husky for git hooks

### How do I set up the development environment?

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/a-search-app.git
   cd a-search-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### How do I run tests?

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### How do I add new features?

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
3. **Write tests**
4. **Update documentation**
5. **Submit a pull request**

## 🚀 Deployment

### How do I deploy A-SEARCH?

**Recommended platforms:**

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker container**

**Steps:**

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform
3. **Deploy the built files**
4. **Configure your domain**

### What environment variables do I need?

**Required:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

**Optional:**

- `NEXT_PUBLIC_APP_URL`
- `EMAIL_PROVIDER`
- `SENDGRID_API_KEY`

### How do I set up a custom domain?

1. **Purchase a domain** from a registrar
2. **Configure DNS** to point to your hosting platform
3. **Set up SSL certificate** (usually automatic)
4. **Update environment variables** with your domain

### How do I monitor the application?

**Built-in monitoring:**

- **Health checks**: `/api/health`
- **Error tracking**: Sentry integration
- **Analytics**: Google Analytics
- **Performance**: Vercel Analytics

**External monitoring:**

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, LogRocket
- **Performance**: New Relic, DataDog

### How do I backup the database?

**Automatic backups:**

- Daily automated backups
- Point-in-time recovery
- Cross-region replication

**Manual backups:**

```bash
# Export data
npm run db:export

# Import data
npm run db:import
```

## 📞 Support

### How do I get help?

1. **Check this FAQ** for common questions
2. **Search the documentation** for detailed guides
3. **Create an issue** on GitHub for bugs
4. **Contact the development team** for urgent issues

### How do I report a bug?

1. **Check if it's already reported** on GitHub
2. **Create a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### How do I request a feature?

1. **Check if it's already requested** on GitHub
2. **Create a feature request** with:
   - Clear description of the feature
   - Use case and benefits
   - Mockups or examples if applicable

### What's the response time for support?

- **Critical issues**: 24 hours
- **Bug reports**: 3-5 business days
- **Feature requests**: 1-2 weeks
- **General questions**: 1 week

---

**Need more help?** Contact us at support@a-search.org

**A-SEARCH** - Empowering health research across Africa 🌍
