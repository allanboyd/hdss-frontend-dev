'use client';

import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('./login/page'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function HomePage() {
  return <LoginPage />;
}
