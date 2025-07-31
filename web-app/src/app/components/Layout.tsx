'use client';
import Link from 'next/link';
import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <nav className="w-60 bg-gray-100 p-4">
        <ul className="space-y-2">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tickets">Tickets</Link></li>
          <li><Link href="/orders">Orders</Link></li>
          <li><Link href="/chat">Chat</Link></li>
        </ul>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}