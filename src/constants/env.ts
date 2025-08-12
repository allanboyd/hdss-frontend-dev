export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true';

/** Environment-specific configurations */
export const env = {
  /** Database */
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  
  /** Application */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  authRedirectUrl: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || 'http://localhost:3000/dashboard',
  
  /** Features */
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableDebugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  enableExperimentalFeatures: process.env.NEXT_PUBLIC_EXPERIMENTAL_FEATURES === 'true',
  
  /** API */
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  maxRetries: parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3'),
  
  /** Security */
  enableCors: process.env.NEXT_PUBLIC_ENABLE_CORS === 'true',
  enableRateLimiting: process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITING === 'true',
} as const;

/** Development-specific configurations */
export const devConfig = {
  enableHotReload: true,
  enableSourceMaps: true,
  enableReactDevTools: true,
  enablePerformanceMonitoring: false,
} as const;

/** Production-specific configurations */
export const prodConfig = {
  enableHotReload: false,
  enableSourceMaps: false,
  enableReactDevTools: false,
  enablePerformanceMonitoring: true,
} as const;

/** Current environment configuration */
export const currentConfig = isProd ? prodConfig : devConfig;
