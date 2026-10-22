import { AuthProvider, useAuth } from '@/lib/auth'
import AuthForm from '@/components/AuthForm'
import ItemsPage from '@/components/ItemsPage'

function Gate() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading…</p>
      </div>
    )
  }

  return session ? <ItemsPage /> : <AuthForm />
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}