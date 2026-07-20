import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { api, formatDate } from '../api'
import DataTable from '../components/DataTable'

const empty = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  role: 'user',
  isActive: true,
}

const emptyFilter = {
  username: '',
  fullName: '',
  email: '',
  role: '',
  status: '',
  createdAt: '',
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [draft, setDraft] = useState(emptyFilter)
  const [applied, setApplied] = useState(emptyFilter)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    try {
      setUsers(await api.getUsers())
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const visible = useMemo(() => {
    const username = applied.username.trim().toLowerCase()
    const fullName = applied.fullName.trim().toLowerCase()
    const email = applied.email.trim().toLowerCase()
    const role = applied.role
    const status = applied.status
    const createdAt = applied.createdAt.trim().toLowerCase()
    return users.filter((u) => {
      if (username && !u.username?.toLowerCase().includes(username)) return false
      if (fullName && !u.fullName?.toLowerCase().includes(fullName)) return false
      if (email && !(u.email || '').toLowerCase().includes(email)) return false
      if (role && u.role !== role) return false
      if (status === 'active' && !u.isActive) return false
      if (status === 'inactive' && u.isActive) return false
      if (createdAt && !formatDate(u.createdAt).toLowerCase().includes(createdAt)) return false
      return true
    })
  }, [users, applied])

  function onSearch() {
    setApplied(draft)
  }

  function onClear() {
    setDraft(emptyFilter)
    setApplied(emptyFilter)
  }

  function openCreate() {
    setEditing(null)
    setForm(empty)
    setShowForm(true)
    setError('')
  }

  function openEdit(u) {
    setEditing(u)
    setForm({
      username: u.username,
      password: '',
      fullName: u.fullName,
      email: u.email || '',
      role: u.role,
      isActive: u.isActive,
    })
    setShowForm(true)
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (editing) {
        await api.updateUser(editing.id, {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          isActive: form.isActive,
          password: form.password || null,
        })
      } else {
        await api.createUser({
          username: form.username,
          password: form.password,
          fullName: form.fullName,
          email: form.email,
          role: form.role,
        })
      }
      setShowForm(false)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(id) {
    if (!confirm('ลบผู้ใช้นี้?')) return
    try {
      await api.deleteUser(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>ผู้ใช้</h1>
          <p className="muted">จัดการบัญชีผู้ใช้ระบบ (เฉพาะ admin)</p>
        </div>
      </header>

      {error && !showForm && <div className="alert">{error}</div>}

      <DataTable
        title="บัญชีผู้ใช้"
        actions={
          <button type="button" className="btn primary" onClick={openCreate}>
            + เพิ่มผู้ใช้
          </button>
        }
        filters={
          <>
            <label className="data-table__filter g-span-2">
              <span>Username</span>
              <input
                type="search"
                placeholder="ค้นหา"
                value={draft.username}
                onChange={(e) => setDraft((f) => ({ ...f, username: e.target.value }))}
              />
            </label>
            <label className="data-table__filter g-span-2">
              <span>ชื่อ</span>
              <input
                type="search"
                placeholder="ค้นหา"
                value={draft.fullName}
                onChange={(e) => setDraft((f) => ({ ...f, fullName: e.target.value }))}
              />
            </label>
            <label className="data-table__filter g-span-3">
              <span>อีเมล</span>
              <input
                type="search"
                placeholder="ค้นหา"
                value={draft.email}
                onChange={(e) => setDraft((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
            <label className="data-table__filter g-span-2">
              <span>บทบาท</span>
              <select
                value={draft.role}
                onChange={(e) => setDraft((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="">ทั้งหมด</option>
                <option value="user">ผู้ใช้</option>
                <option value="admin">ผู้ดูแล</option>
              </select>
            </label>
            <label className="data-table__filter g-span-1">
              <span>สถานะ</span>
              <select
                value={draft.status}
                onChange={(e) => setDraft((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="">ทั้งหมด</option>
                <option value="active">ใช้งาน</option>
                <option value="inactive">ปิด</option>
              </select>
            </label>
            <label className="data-table__filter g-span-2">
              <span>สร้างเมื่อ</span>
              <input
                type="search"
                placeholder="ค้นหา"
                value={draft.createdAt}
                onChange={(e) => setDraft((f) => ({ ...f, createdAt: e.target.value }))}
              />
            </label>
          </>
        }
        filterActions={
          <>
            <button type="button" className="btn primary" onClick={onSearch}>
              ค้นหา
            </button>
            <button type="button" className="btn ghost" onClick={onClear}>
              ล้าง
            </button>
          </>
        }
      >
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>บทบาท</th>
              <th>สถานะ</th>
              <th>สร้างเมื่อ</th>
              <th className="data-table__actions-col" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="data-table__empty">
                  ไม่พบผู้ใช้
                </td>
              </tr>
            ) : (
              visible.map((u) => (
                <tr key={u.id}>
                  <td>
                    <code className="data-table__code">{u.username}</code>
                  </td>
                  <td className="data-table__title">{u.fullName}</td>
                  <td>{u.email || '—'}</td>
                  <td>{u.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}</td>
                  <td>
                    <span className={u.isActive ? 'tag-in' : 'tag-out'}>
                      {u.isActive ? 'ใช้งาน' : 'ปิด'}
                    </span>
                  </td>
                  <td className="data-table__date">{formatDate(u.createdAt)}</td>
                  <td className="actions">
                    <button type="button" className="btn ghost sm" onClick={() => openEdit(u)}>
                      แก้ไข
                    </button>
                    <button type="button" className="btn danger sm" onClick={() => onDelete(u.id)}>
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataTable>

      {showForm &&
        createPortal(
          <div className="modal-backdrop" onClick={() => setShowForm(false)}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit}>
              <h2>{editing ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้'}</h2>
              {error && <div className="alert">{error}</div>}
              <div className="form-grid">
                {!editing && (
                  <label>
                    Username
                    <input
                      required
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                  </label>
                )}
                <label>
                  รหัสผ่าน{editing ? ' (ว่าง = ไม่เปลี่ยน)' : ''}
                  <input
                    type="password"
                    required={!editing}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </label>
                <label>
                  ชื่อเต็ม
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </label>
                <label>
                  อีเมล
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
                <label>
                  บทบาท
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="user">ผู้ใช้</option>
                    <option value="admin">ผู้ดูแล</option>
                  </select>
                </label>
                {editing && (
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    เปิดใช้งาน
                  </label>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setShowForm(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn primary" disabled={busy}>
                  {busy ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </div>
  )
}
