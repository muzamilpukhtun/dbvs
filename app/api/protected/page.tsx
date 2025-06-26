// app/api/protected/page.tsx
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function ProtectedPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  return <div>Protected Content</div>
}