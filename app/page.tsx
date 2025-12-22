'use client'
import dynamic from 'next/dynamic'

const PocketProfileClient = dynamic(() => import('./page.client').then(mod => ({ default: mod.PocketProfileClient })), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function Page() {
  return <PocketProfileClient />
}