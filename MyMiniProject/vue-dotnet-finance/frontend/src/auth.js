import { reactive, inject } from 'vue'
import { api } from './api'

export const authState = reactive({
  user: null,
  loading: true,
})

export async function initAuth() {
  const token = localStorage.getItem('token')
  if (!token) {
    authState.loading = false
    return
  }
  try {
    authState.user = await api.me()
  } catch {
    localStorage.removeItem('token')
    authState.user = null
  } finally {
    authState.loading = false
  }
}

export async function login(username, password) {
  const res = await api.login(username, password)
  localStorage.setItem('token', res.token)
  authState.user = res.user
  return res.user
}

export function logout() {
  localStorage.removeItem('token')
  authState.user = null
}

const AuthKey = Symbol('auth')

export const AuthPlugin = {
  install(app) {
    app.provide(AuthKey, {
      get user() {
        return authState.user
      },
      get loading() {
        return authState.loading
      },
      get isAdmin() {
        return authState.user?.role === 'admin'
      },
      login,
      logout,
    })
  },
}

export function useAuth() {
  const auth = inject(AuthKey)
  if (!auth) throw new Error('useAuth() requires AuthPlugin')
  return auth
}
