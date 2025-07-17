# A-SEARCH Dashboard

A modern Next.js application for collecting, accessing, and analyzing population and health data across African research sites.

## Features

- 🔐 **Authentication**: Supabase-powered authentication with email/password
- 📊 **Dashboard**: Comprehensive data visualization and analytics
- 🎨 **Modern UI**: Beautiful 50-50 split layout with responsive design
- 🛡️ **Protected Routes**: Middleware-based route protection
- 📱 **Responsive**: Mobile-friendly design
- ⚡ **Fast**: Built with Next.js 15 and Turbopack

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Authentication pages
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard-specific components
│   └── ui/              # Base UI components
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Supabase client configuration
│   ├── auth-context.tsx # Authentication context
│   └── utils.ts         # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── middleware.ts        # Route protection middleware
└── .env.local          # Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd a-search-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/dashboard
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication Flow

1. **Sign Up**: Users can create new accounts with email/password
2. **Sign In**: Existing users can log in with their credentials
3. **Protected Routes**: Dashboard and other sensitive pages require authentication
4. **Auto-redirect**: Authenticated users are redirected to dashboard, unauthenticated users to login

## Key Features

### 50-50 Login Layout
- Left side: Hero section with dashboard preview and branding
- Right side: Clean authentication form with toggle between sign-in/sign-up

### Protected Dashboard
- Comprehensive data visualization
- Real-time statistics
- Interactive charts and maps
- User management and settings

### Supabase Integration
- Secure authentication
- Real-time data synchronization
- Row Level Security (RLS) support
- Database management

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `NEXT_PUBLIC_AUTH_REDIRECT_URL` | URL to redirect after successful auth | No |
| `NEXT_PUBLIC_SITE_URL` | Your site's base URL | No |

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
# hdss-frontend-dev
