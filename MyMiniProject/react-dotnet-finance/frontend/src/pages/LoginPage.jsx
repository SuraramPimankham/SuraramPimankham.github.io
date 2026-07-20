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
      <section className="login-hero" aria-hidden="true">
        <p className="login-hero__eyebrow">Ledger</p>
        <h1 className="login-hero__title">
          ระบบรายรับรายจ่าย
          <span>ที่อ่านง่าย และพร้อมหลักฐาน</span>
        </h1>
        <ul className="login-hero__points">
          <li>บันทึกรายการพร้อมสลิป</li>
          <li>สรุปยอดแบบเรียลไทม์</li>
          <li>แยกสิทธิ์ผู้ใช้ / ผู้ดูแล</li>
        </ul>
      </section>
      <form className="login-card" onSubmit={onSubmit}>
        <h2>Sign in</h2>
        <p className="muted">เข้าสู่ระบบเพื่อจัดการบัญชีของคุณ</p>
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
        <button className="btn primary wide" disabled={busy} type="submit">
          {busy ? 'กำลังเข้าสู่ระบบ...' : 'Continue'}
        </button>
        <p className="hint">
          Demo: <code>admin / admin123</code> · <code>user / user123</code>
        </p>
      </form>
    </div>
  )
}
