import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ฿
          </span>
          <div>
            <strong>Ledger</strong>
            <small>Finance</small>
          </div>
        </div>
        <nav aria-label="หลัก">
          <NavLink to="/" end>
            แดชบอร์ด
          </NavLink>
          <NavLink to="/transactions">รายการ</NavLink>
          {isAdmin && <NavLink to="/users">ผู้ใช้</NavLink>}
        </nav>
        <div className="side-foot">
          <div className="who">
            <strong>{user?.fullName}</strong>
            <span>{user?.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}</span>
          </div>
          <button type="button" className="btn ghost" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
