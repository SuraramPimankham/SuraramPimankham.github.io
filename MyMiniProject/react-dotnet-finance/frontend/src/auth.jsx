import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(username, password) {
    const res = await api.login(username, password)
    localStorage.setItem('token', res.token)
    setUser(res.user)
    return res.user
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
