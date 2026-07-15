import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function LoginPage() {
  const { user, login, loading } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(username, password)
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-visual" aria-hidden="true">
        <div className="login-orb" />
        <p className="login-tagline">บันทึกรายรับรายจ่าย พร้อมหลักฐานชัดเจน</p>
      </div>
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Ledger</h1>
        <p className="muted">เข้าสู่ระบบเพื่อจัดการการเงิน</p>
        {error && <div className="alert">{error}</div>}
        <label>
          ชื่อผู้ใช้
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          รหัสผ่าน
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button className="btn primary" disabled={busy} type="submit">
          {busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        <p className="hint">
          ทดลอง: <code>admin / admin123</code> หรือ <code>user / user123</code>
        </p>
      </form>
    </div>
  )
}
