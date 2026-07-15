import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { api, formatDate } from '../api'

const empty = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  role: 'user',
  isActive: true,
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
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
        <button type="button" className="btn primary" onClick={openCreate}>
          + เพิ่มผู้ใช้
        </button>
      </header>

      {error && !showForm && <div className="alert">{error}</div>}

      <div className="table-wrap panel">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>บทบาท</th>
              <th>สถานะ</th>
              <th>สร้างเมื่อ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <code>{u.username}</code>
                </td>
                <td>{u.fullName}</td>
                <td>{u.email || '—'}</td>
                <td>{u.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}</td>
                <td>
                  <span className={u.isActive ? 'tag-in' : 'tag-out'}>
                    {u.isActive ? 'ใช้งาน' : 'ปิด'}
                  </span>
                </td>
                <td>{formatDate(u.createdAt)}</td>
                <td className="actions">
                  <button type="button" className="btn ghost sm" onClick={() => openEdit(u)}>
                    แก้ไข
                  </button>
                  <button type="button" className="btn danger sm" onClick={() => onDelete(u.id)}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
