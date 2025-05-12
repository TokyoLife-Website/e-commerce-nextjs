'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const steps = [
  { name: 'Giỏ hàng', path: '/cart' },
  { name: 'Thanh toán', path: '/checkout' },
  { name: 'Hoàn thành', path: '/order-complete' },
];

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = steps.findIndex((step) => pathname === step.path);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stepper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, index) => (
              <li key={step.name} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900">{step.name}</span>
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div className="absolute top-4 left-8 -ml-px mt-0.5 h-0.5 w-full bg-gray-200">
                    <div
                      className="h-0.5 bg-blue-600"
                      style={{ width: index < currentStep ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 