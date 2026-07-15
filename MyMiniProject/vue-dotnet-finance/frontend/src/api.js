const API = '/api'

function authHeaders(isJson = true) {
  const token = localStorage.getItem('token')
  const h = {}
  if (isJson) h['Content-Type'] = 'application/json'
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

async function parse(res) {
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  login: (username, password) =>
    fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ username, password }),
    }).then(parse),

  me: () => fetch(`${API}/auth/me`, { headers: authHeaders() }).then(parse),

  getUsers: () => fetch(`${API}/users`, { headers: authHeaders() }).then(parse),
  createUser: (body) =>
    fetch(`${API}/users`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(parse),
  updateUser: (id, body) =>
    fetch(`${API}/users/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(parse),
  deleteUser: (id) =>
    fetch(`${API}/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders(false),
    }).then(parse),

  getTransactions: (params = {}) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v)
    })
    const qs = q.toString()
    return fetch(`${API}/transactions${qs ? `?${qs}` : ''}`, {
      headers: authHeaders(),
    }).then(parse)
  },
  saveTransaction: (id, formData) =>
    fetch(`${API}/transactions${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: authHeaders(false),
      body: formData,
    }).then(parse),
  deleteTransaction: (id) =>
    fetch(`${API}/transactions/${id}`, {
      method: 'DELETE',
      headers: authHeaders(false),
    }).then(parse),

  dashboard: (userId) => {
    const qs = userId ? `?userId=${userId}` : ''
    return fetch(`${API}/dashboard${qs}`, { headers: authHeaders() }).then(parse)
  },
}

export function money(n) {
  return Number(n || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function slipUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return path
}
