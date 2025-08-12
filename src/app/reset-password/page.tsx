'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        // If no session, redirect to login
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin mx-auto mb-4 text-gray-400' />
          <p className='text-gray-600'>Validating session...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8'>
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
              <CheckCircle className='w-8 h-8 text-green-600' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Password Updated Successfully!
            </h1>
            <p className='text-gray-600 mb-6'>
              Your password has been updated. You will be redirected to the
              login page shortly.
            </p>
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <p className='text-sm text-green-700'>
                You can now sign in with your new password.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col lg:flex-row bg-white'>
      {/* Left Side - Hero Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-6 sm:p-8 lg:p-10 xl:p-12 bg-[url('/svg/bg_login.svg')] bg-cover bg-center bg-no-repeat m-0 lg:m-10 rounded-none lg:rounded-2xl">
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

        {/* Content */}
        <div className='w-full flex flex-col items-center justify-center z-10'>
          <div className='text-center max-w-xs sm:max-w-md w-full'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight'>
              Reset Your Password
            </h2>
            <p className='text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed'>
              Create a new secure password for your A-SEARCH account.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white'>
        <div className='w-full max-w-md'>
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
              Set New Password
            </h1>
            <p className='text-gray-600'>
              Please enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='password' className='text-gray-700 font-medium'>
                New Password
              </Label>
              <div className='relative mt-2'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-12'
                  placeholder='Enter your new password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-1'>
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <Label
                htmlFor='confirmPassword'
                className='text-gray-700 font-medium'
              >
                Confirm New Password
              </Label>
              <div className='relative mt-2'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className='h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-12'
                  placeholder='Confirm your new password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2'>
                <AlertCircle className='w-4 h-4' />
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
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>

          <div className='text-center mt-6'>
            <Button
              variant='outline'
              onClick={() => router.push('/login')}
              className='border-gray-300 text-gray-700 hover:bg-gray-50'
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
