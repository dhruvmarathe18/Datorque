'use client';

import Link from 'next/link';
import { ShieldX, Smartphone, ArrowLeft } from 'lucide-react';

export default function NotAllowedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldX className="h-12 w-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access the web portal.
          This portal is only available for administrators and staff members.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-3 text-blue-700 mb-3">
            <Smartphone className="h-6 w-6" />
            <span className="font-semibold">Students & Parents</span>
          </div>
          <p className="text-blue-600 text-sm">
            Please use our mobile app available on iOS and Android for the best experience.
          </p>
        </div>
        
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
