'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select/Select';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { authServices } from '@/lib/auth-services';
import { Role } from '@/types/user-management';
import { Site } from '@/types/site-management';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAccountRequest, setShowAccountRequest] = useState(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+254',
    requestedRoleId: '',
    requestedSiteId: '',
    reason: '',
  });

  const [publicRoles, setPublicRoles] = useState<Role[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();

  // Countries data
  const countries = [
    { code: '+254', name: 'Kenya' },
    { code: '+256', name: 'Uganda' },
    { code: '+255', name: 'Tanzania' },
    { code: '+27', name: 'South Africa' },
    { code: '+234', name: 'Nigeria' },
    { code: '+233', name: 'Ghana' },
    { code: '+251', name: 'Ethiopia' },
    { code: '+1', name: 'United States' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+33', name: 'France' },
    { code: '+49', name: 'Germany' },
  ];

  // Load public roles and sites for INSPIRE network form
  useEffect(() => {
    const loadData = async () => {
      if (showAccountRequest) {
        setIsLoadingData(true);
        try {
          console.log('Loading public roles and sites...');
          const [rolesData, sitesData] = await Promise.all([
            authServices.getSystemRoles(),
            authServices.getAllSites(),
          ]);
          console.log('Loaded roles:', rolesData);
          console.log('Loaded sites:', sitesData);
          setPublicRoles(rolesData);
          setSites(sitesData);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadData();
  }, [showAccountRequest]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAccountRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestLoading(true);
    setRequestError('');

    try {
      const { error } = await supabase.from('user_account_request').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone_number: `${formData.countryCode}${formData.phoneNumber}`,
          requested_role_id: parseInt(formData.requestedRoleId),
          requested_site_id: parseInt(formData.requestedSiteId),
          reason: formData.reason,
          status: 'pending',
        },
      ]);

      if (error) {
        setRequestError(error.message);
      } else {
        setIsRequestSuccess(true);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          countryCode: '+254',
          requestedRoleId: '',
          requestedSiteId: '',
          reason: '',
        });
      }
    } catch {
      setRequestError('An unexpected error occurred');
    } finally {
      setIsRequestLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);
    setForgotPasswordError('');

    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(
        forgotPasswordEmail,
        {
          redirectTo: redirectUrl || (undefined as any),
        }
      );

      if (error) {
        setForgotPasswordError(error.message);
      } else {
        setForgotPasswordSuccess(true);
        setForgotPasswordEmail('');
      }
    } catch {
      setForgotPasswordError('An unexpected error occurred');
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // For external users, create account with first public role
        const fullName = (e.target as HTMLFormElement).fullName?.value || '';
        const phoneNumber =
          (e.target as HTMLFormElement).phoneNumber?.value || '';
        const countryCode =
          (e.target as HTMLFormElement).countryCode?.value || '+254';

        const result = await authServices.createUserWithSystemRole({
          email,
          password,
          full_name: fullName,
          phone_number: `${countryCode}${phoneNumber}`,
        });

        if (result) {
          router.push('/dashboard');
        }
      } else {
        // Regular sign in
        const { error } = await signIn(email, password);
        if (error) {
          setError(
            typeof error === 'object' && error !== null && 'message' in error
              ? String(error.message)
              : 'An error occurred during authentication'
          );
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col lg:flex-row bg-white'>
      {/* Left Side - Hero Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative overflow-hidden bg-[url('/svg/bg_login.svg')] bg-cover bg-center p-6 sm:p-8 lg:p-10 xl:p-12 m-0 lg:m-10 rounded-none lg:rounded-2xl">
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10 pointer-events-none'> 
          <div className='absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-amber-300 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-10 w-24 h-24 sm:w-40 sm:h-40 bg-orange-300 rounded-full blur-3xl'></div>
        </div>
        {/* Logo */}
        <div className='absolute top-4 left-4 sm:top-8 sm:left-8 z-10'>
          <Image
            src='/images/aphrc_mainlogo.png'
            alt='APHRC Logo'
            width={180}
            height={50}
            className='object-contain w-28 h-8 sm:w-40 sm:h-12 md:w-44 md:h-12 lg:w-48 lg:h-14'
            priority
          />
        </div>
        {/* Dashboard Preview & Content */}
        <div className='flex flex-col items-center justify-center z-10 bg-[url("/svg/bg_login_content.svg")] bg-cover bg-center p-8 sm:p-10 rounded-2xl'>
          <div className='mb-8 sm:mb-12 max-w-xs sm:max-w-md w-full'>
            <div className='bg-white rounded-2xl shadow-2xl p-2 sm:p-4 transform rotate-0 hover:rotate-3 transition-transform duration-300'>
              <Image
                src='/svg/dashboard.svg'
                alt='Dashboard Preview'
                width={400}
                height={300}
                className='rounded-lg w-full h-auto'
              />
            </div>
          </div>
          <div className='text-center max-w-xs sm:max-w-md w-full'>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-6 leading-tight'>
              For Field agents, researchers, & policymakers
            </h2>
            <p className='text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed'>
              Collect, access, and analyze population and health data across
              African research sites with ease and clarity.
            </p>
            <div className='flex justify-center gap-2 sm:gap-3 mb-2'>
              <div className='w-2 h-2 sm:w-3 sm:h-3 bg-amber-600 rounded-full shadow-sm animate-pulse'></div>
              <div className='w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full shadow-sm'></div>
              <div className='w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full shadow-sm'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Signup/Request Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white'>
        <div className='w-full max-w-md'>
          {!showAccountRequest &&
            !isRequestSuccess &&
            !showForgotPassword &&
            !forgotPasswordSuccess && (
              <>
                <div className='text-center mb-8'>
                  <h1 className='text-3xl font-bold text-gray-800 mb-3'>
                    {isSignUp ? 'Create Account' : 'Welcome back'}
                  </h1>
                  <p className='text-gray-600'>
                    {isSignUp
                      ? 'Join A-SEARCH to start collecting and analyzing health data.'
                      : 'Access your personalized dashboard to collect, explore, or manage health and population data.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {isSignUp && (
                    <div>
                      <Label
                        htmlFor='fullName'
                        className='text-gray-700 font-medium'
                      >
                        Full Name
                      </Label>
                      <Input
                        id='fullName'
                        type='text'
                        placeholder='Enter your full name'
                        className='mt-2 h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500'
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label
                      htmlFor='email'
                      className='text-gray-700 font-medium'
                    >
                      Email
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='e.g. johndoe@gmail.com'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className='mt-2 h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500'
                      required
                    />
                  </div>

                  {isSignUp && (
                    <div>
                      <Label
                        htmlFor='phoneNumber'
                        className='text-gray-700 font-medium'
                      >
                        Phone Number
                      </Label>
                      <div className='mt-2 flex gap-2'>
                        <Select defaultValue='+254'>
                          <SelectTrigger className='w-28 h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                              >
                                {country.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          id='phoneNumber'
                          type='tel'
                          placeholder='Phone number'
                          className='flex-1 h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500'
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label
                      htmlFor='password'
                      className='text-gray-700 font-medium'
                    >
                      Password
                    </Label>
                    <div className='relative mt-2'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-12'
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {!isSignUp && (
                      <div className='text-right mt-2'>
                        <button
                          type='button'
                          onClick={() => setShowForgotPassword(true)}
                          className='text-amber-600 text-sm hover:underline font-medium'
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
                      {error}
                    </div>
                  )}

                  <Button
                    type='submit'
                    className='w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 h-12 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-[1.02]'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className='flex items-center gap-2'>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </div>
                    ) : isSignUp ? (
                      'Create Account'
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className='text-center my-8'>
                  <span className='text-gray-500 bg-white px-4 relative'>
                    <span className='absolute inset-0 flex items-center'>
                      <span className='w-full border-t border-gray-300'></span>
                    </span>
                    <span className='relative bg-white px-4 text-gray-500'>
                      or
                    </span>
                  </span>
                </div>

                <div className='space-y-4'>
                  <p className='text-center text-gray-600 text-sm font-medium'>
                    {isSignUp
                      ? 'Already have an account?'
                      : "It's my first time accessing A-SEARCH"}
                  </p>

                  <div className='space-y-3'>
                    {!isSignUp && (
                      <Button
                        variant='outline'
                        className='w-full border-2 border-gray-300 text-gray-700 py-3 h-12 rounded-lg bg-transparent hover:bg-gray-50 font-medium'
                        onClick={() => setIsSignUp(!isSignUp)}
                      >
                        Get Started (External User)
                      </Button>
                    )}

                    <Button
                      variant='outline'
                      className='w-full border-2 border-gray-300 text-gray-700 py-3 h-12 rounded-lg bg-transparent hover:bg-gray-50 font-medium'
                      onClick={() => {
                        if (isSignUp) {
                          setIsSignUp(false);
                          setShowAccountRequest(false);
                        } else {
                          setShowAccountRequest(true);
                        }
                      }}
                    >
                      {isSignUp
                        ? 'Sign In Instead'
                        : 'Get Started (INSPIRE Member)'}
                    </Button>
                  </div>
                </div>
              </>
            )}

          {/* Account Request Form */}
          {showAccountRequest && !isRequestSuccess && (
            <div className='w-full'>
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-4 shadow-lg'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    />
                  </svg>
                </div>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                  Request Account Access
                </h1>
                <p className='text-gray-600'>
                  Fill out the form below to request access to the A-SEARCH
                  platform
                </p>
              </div>

              <form onSubmit={handleAccountRequest} className='space-y-4'>
                <div>
                  <Label
                    htmlFor='fullName'
                    className='text-gray-700 font-semibold text-sm uppercase tracking-wide'
                  >
                    Full Name *
                  </Label>
                  <Input
                    id='fullName'
                    type='text'
                    placeholder='Enter your full name'
                    value={formData.fullName}
                    onChange={e =>
                      handleInputChange('fullName', e.target.value)
                    }
                    className='mt-2 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor='requestEmail'
                    className='text-gray-700 font-semibold text-sm uppercase tracking-wide'
                  >
                    Email Address *
                  </Label>
                  <Input
                    id='requestEmail'
                    type='email'
                    placeholder='e.g. johndoe@gmail.com'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className='mt-2 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor='phoneNumber'
                    className='text-gray-700 font-semibold text-sm uppercase tracking-wide'
                  >
                    Phone Number *
                  </Label>
                  <div className='mt-2 flex gap-2'>
                    <Select
                      value={formData.countryCode}
                      onValueChange={value =>
                        handleInputChange('countryCode', value)
                      }
                    >
                      <SelectTrigger className='w-28 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id='phoneNumber'
                      type='tel'
                      placeholder='Phone number'
                      value={formData.phoneNumber}
                      onChange={e =>
                        handleInputChange('phoneNumber', e.target.value)
                      }
                      className='flex-1 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                      required
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='w-full'>
                    <Label
                      htmlFor='role'
                      className='text-gray-700 font-semibold text-sm uppercase tracking-wide'
                    >
                      Requested Role *
                    </Label>
                    <Select
                      value={formData.requestedRoleId}
                      onValueChange={value =>
                        handleInputChange('requestedRoleId', value)
                      }
                      disabled={isLoadingData}
                    >
                      <SelectTrigger className='mt-2 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 w-full'>
                        <SelectValue
                          placeholder={
                            isLoadingData
                              ? 'Loading roles...'
                              : 'Select your role'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingData ? (
                          <div className='p-4 text-center text-gray-500'>
                            <Loader2 className='w-4 h-4 animate-spin mx-auto mb-2' />
                            Loading roles...
                          </div>
                        ) : (
                          publicRoles.map(role => (
                            <SelectItem
                              key={role.role_id}
                              value={role.role_id.toString()}
                            >
                              <div className='py-1'>
                                <div className='font-semibold text-gray-900'>
                                  {role.role_name}
                                </div>
                                <div className='text-sm text-gray-600'>
                                  {role.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='w-full'>
                    <Label
                      htmlFor='site'
                      className='text-gray-700 font-semibold text-sm uppercase tracking-wide'
                    >
                      Requested Site *
                    </Label>
                    <Select
                      value={formData.requestedSiteId}
                      onValueChange={value =>
                        handleInputChange('requestedSiteId', value)
                      }
                      disabled={isLoadingData}
                    >
                      <SelectTrigger className='mt-2 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500 w-full'>
                        <SelectValue
                          placeholder={
                            isLoadingData ? 'Loading sites...' : 'Select a site'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingData ? (
                          <div className='p-4 text-center text-gray-500'>
                            <Loader2 className='w-4 h-4 animate-spin mx-auto mb-2' />
                            Loading sites...
                          </div>
                        ) : (
                          sites.map(site => (
                            <SelectItem
                              key={site.site_id}
                              value={site.site_id.toString()}
                            >
                              <div className='py-1'>
                                <div className='font-semibold text-gray-900'>
                                  {site.name}
                                </div>
                                <div className='text-sm text-gray-600'>
                                  {site.country?.name || 'Unknown'} -{' '}
                                  {site.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor='reason'
                    className='text-gray-700 font-semibold text-sm uppercase tracking-wide'
                  >
                    Reason for Access Request *
                  </Label>
                  <Textarea
                    id='reason'
                    placeholder='Please explain why you need access to the platform...'
                    value={formData.reason}
                    onChange={e => handleInputChange('reason', e.target.value)}
                    className='mt-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-[80px]'
                    rows={3}
                    required
                  />
                </div>

                {requestError && (
                  <div className='bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <svg
                          className='h-4 w-4 text-red-400'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-2'>
                        <p className='text-sm text-red-700'>{requestError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className='flex gap-3 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setShowAccountRequest(false);
                      setIsSignUp(false);
                    }}
                    className='flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12'
                  >
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back to Sign In
                  </Button>
                  <Button
                    type='submit'
                    className='flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-3 h-12 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg'
                    disabled={isRequestLoading}
                  >
                    {isRequestLoading ? (
                      <div className='flex items-center gap-2'>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Submitting...
                      </div>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Success Message */}
          {isRequestSuccess && (
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg'>
                <CheckCircle className='w-10 h-10 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                Request Submitted Successfully!
              </h2>
              <p className='text-gray-600 mb-6'>
                Your account request has been submitted and is under review.
                We&apos;ll contact you via email once your account is approved.
              </p>
              <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <p className='text-sm text-green-700'>
                    You will receive a confirmation email shortly.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setIsRequestSuccess(false);
                  setShowAccountRequest(false);
                }}
                className='w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-3 h-12 rounded-lg font-semibold transition-all duration-300'
              >
                Return to Login
              </Button>
            </div>
          )}

          {/* Forgot Password Form */}
          {showForgotPassword && !forgotPasswordSuccess && (
            <div className='w-full'>
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-4 shadow-lg'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                    />
                  </svg>
                </div>
                <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                  Reset Your Password
                </h1>
                <p className='text-gray-600'>
                  Enter your email address and we&apos;ll send you a link to
                  reset your password
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className='space-y-6'>
                <div>
                  <Label
                    htmlFor='forgotEmail'
                    className='text-gray-700 font-semibold text-sm uppercase tracking-wide'
                  >
                    Email Address *
                  </Label>
                  <Input
                    id='forgotEmail'
                    type='email'
                    placeholder='e.g. johndoe@gmail.com'
                    value={forgotPasswordEmail}
                    onChange={e => setForgotPasswordEmail(e.target.value)}
                    className='mt-2 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                    required
                  />
                </div>

                {forgotPasswordError && (
                  <div className='bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <svg
                          className='h-4 w-4 text-red-400'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-2'>
                        <p className='text-sm text-red-700'>
                          {forgotPasswordError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className='space-y-6 pt-4'>
                  <Button
                    type='submit'
                    className='w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-3 h-12 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg'
                    disabled={isForgotPasswordLoading}
                  >
                    {isForgotPasswordLoading ? (
                      <div className='flex items-center gap-2'>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Sending...
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>

                  <div className='text-center'>
                    <span className='text-gray-500 bg-white px-4 relative'>
                      <span className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t border-gray-300'></span>
                      </span>
                      <span className='relative bg-white px-4 text-gray-500'>
                        or
                      </span>
                    </span>
                  </div>

                  <div className='text-center'>
                    <p className='text-gray-600 text-sm font-medium mb-3'>
                      Remember your password?
                    </p>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordError('');
                        setForgotPasswordEmail('');
                      }}
                      className='w-full border-2 border-gray-300 text-gray-700 py-3 h-12 rounded-lg bg-transparent hover:bg-gray-50 font-medium'
                    >
                      <ArrowLeft className='w-4 h-4 mr-2' />
                      Return to Sign In
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Forgot Password Success */}
          {forgotPasswordSuccess && (
            <div className='text-center'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-6 shadow-lg'>
                <svg
                  className='w-10 h-10 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                Check Your Email
              </h2>
              <p className='text-gray-600 mb-6'>
                We&apos;ve sent a password reset link to your email address.
                Please check your inbox and follow the instructions to reset
                your password.
              </p>
              <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-4 h-4 text-amber-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <p className='text-sm text-amber-700'>
                    If you don&apos;t see the email, check your spam folder.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setForgotPasswordSuccess(false);
                  setShowForgotPassword(false);
                }}
                className='w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-3 h-12 rounded-lg font-semibold transition-all duration-300'
              >
                Return to Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
