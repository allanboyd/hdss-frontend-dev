'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopBar } from '@/components/dashboard/top-bar';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  targetDate?: Date;
  features?: string[];
}

export function ComingSoon({
  title,
  description,
  icon: Icon,
  targetDate = new Date('2024-12-31T23:59:59'),
  features = [],
}: ComingSoonProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />

      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Bar */}
        <TopBar />

        <div className='flex-1 p-4 overflow-y-auto'>
          <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-6 shadow-lg'>
                <Icon className='w-10 h-10 text-white' />
              </div>
              <h1 className='text-4xl font-bold text-gray-900 mb-4'>{title}</h1>
              <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                {description}
              </p>
            </div>

            {/* Countdown */}
            <Card className='mb-8 shadow-sm border border-gray-200'>
              <CardHeader className='text-center pb-4'>
                <CardTitle className='flex items-center justify-center gap-2 text-gray-900'>
                  <Clock className='w-5 h-5 text-orange-600' />
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-orange-600 mb-1'>
                      {timeLeft.days}
                    </div>
                    <div className='text-sm text-gray-600'>Days</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-orange-600 mb-1'>
                      {timeLeft.hours}
                    </div>
                    <div className='text-sm text-gray-600'>Hours</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-orange-600 mb-1'>
                      {timeLeft.minutes}
                    </div>
                    <div className='text-sm text-gray-600'>Minutes</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-orange-600 mb-1'>
                      {timeLeft.seconds}
                    </div>
                    <div className='text-sm text-gray-600'>Seconds</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {features.length > 0 && (
              <Card className='mb-8 shadow-sm border border-gray-200'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-gray-900'>
                    <Sparkles className='w-5 h-5 text-orange-600' />
                    What&apos;s Coming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid md:grid-cols-2 gap-4'>
                    {features.map((feature, index) => (
                      <div key={index} className='flex items-start gap-3'>
                        <div className='w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0'></div>
                        <p className='text-gray-700'>{feature}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className='text-center space-y-4'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg'
              >
                Get Notified
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
              <div className='text-sm text-gray-500'>
                We&apos;ll notify you when this feature is ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
