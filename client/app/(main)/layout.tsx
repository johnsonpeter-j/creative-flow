'use client';

import AppBar from '@/components/campaign/AppBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      {children}
    </div>
  );
}


