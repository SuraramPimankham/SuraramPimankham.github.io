import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import UsersPage from './pages/UsersPage'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="boot">กำลังโหลด...</div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route
          path="users"
          element={
            <PrivateRoute adminOnly>
              <UsersPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
