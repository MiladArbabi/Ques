// web-app/src/app/page.tsx
import React from 'react'
import { Layout } from './components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Welcome to Ques Dashboard</h1>
      <p>Select “Tickets”, “Orders” or “Chat” from the sidebar to get started.</p>
    </Layout>
  )
}
