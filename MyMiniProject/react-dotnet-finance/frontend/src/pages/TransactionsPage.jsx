import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { api, formatDate, money, slipUrl } from '../api'
import { useAuth } from '../auth'

const emptyForm = {
  type: 'expense',
  category: '',
  title: '',
  note: '',
  amount: '',
  occurredAt: new Date().toISOString().slice(0, 10),
  userId: '',
  clearSlip: false,
}

export default function TransactionsPage() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState({ type: '', category: '' })
  const [form, setForm] = useState(emptyForm)
  const [slip, setSlip] = useState(null)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    try {
      const data = await api.getTransactions(filter)
      setItems(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [filter.type, filter.category])

  useEffect(() => {
    if (isAdmin) api.getUsers().then(setUsers).catch(() => {})
  }, [isAdmin])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setSlip(null)
    setShowForm(true)
    setError('')
  }

  function openEdit(t) {
    setEditing(t)
    setForm({
      type: t.type,
      category: t.category,
      title: t.title,
      note: t.note || '',
      amount: String(t.amount),
      occurredAt: t.occurredAt?.slice(0, 10) || '',
      userId: String(t.userId),
      clearSlip: false,
    })
    setSlip(null)
    setShowForm(true)
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('type', form.type)
      fd.append('category', form.category)
      fd.append('title', form.title)
      fd.append('note', form.note || '')
      fd.append('amount', form.amount)
      if (form.occurredAt) fd.append('occurredAt', new Date(form.occurredAt).toISOString())
      if (isAdmin && form.userId) fd.append('userId', form.userId)
      if (form.clearSlip) fd.append('clearSlip', 'true')
      if (slip) fd.append('slip', slip)

      await api.saveTransaction(editing?.id, fd)
      setShowForm(false)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(id) {
    if (!confirm('ลบรายการนี้?')) return
    try {
      await api.deleteTransaction(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>รายรับรายจ่าย</h1>
          <p className="muted">บันทึกรายการพร้อมรูปสลิปหรือหลักฐาน</p>
        </div>
        <button type="button" className="btn primary" onClick={openCreate}>
          + เพิ่มรายการ
        </button>
      </header>

      <div className="filters">
        <select value={filter.type} onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}>
          <option value="">ทุกประเภท</option>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <input
          placeholder="ค้นหาหมวดหมู่"
          value={filter.category}
          onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
        />
      </div>

      {error && !showForm && <div className="alert">{error}</div>}

      <div className="table-wrap panel">
        <table>
          <thead>
            <tr>
              <th>วันที่</th>
              <th>หัวข้อ</th>
              <th>หมวด</th>
              {isAdmin && <th>ผู้ใช้</th>}
              <th>ประเภท</th>
              <th className="num">จำนวน</th>
              <th>สลิป</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="muted">
                  ยังไม่มีรายการ
                </td>
              </tr>
            )}
            {items.map((t) => (
              <tr key={t.id}>
                <td>{formatDate(t.occurredAt)}</td>
                <td>
                  <strong>{t.title}</strong>
                  {t.note && <div className="muted small">{t.note}</div>}
                </td>
                <td>{t.category}</td>
                {isAdmin && <td>{t.userName}</td>}
                <td>
                  <span className={t.type === 'income' ? 'tag-in' : 'tag-out'}>
                    {t.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                  </span>
                </td>
                <td className={`num ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}฿{money(t.amount)}
                </td>
                <td>
                  {t.slipPath ? (
                    <a href={slipUrl(t.slipPath)} target="_blank" rel="noreferrer" className="slip-link">
                      ดูรูป
                    </a>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td className="actions">
                  <button type="button" className="btn ghost sm" onClick={() => openEdit(t)}>
                    แก้ไข
                  </button>
                  <button type="button" className="btn danger sm" onClick={() => onDelete(t.id)}>
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
              <h2>{editing ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}</h2>
              {error && <div className="alert">{error}</div>}
              <div className="form-grid">
                <label>
                  ประเภท
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="income">รายรับ</option>
                    <option value="expense">รายจ่าย</option>
                  </select>
                </label>
                <label>
                  จำนวนเงิน
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </label>
                <label>
                  หมวดหมู่
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="เช่น อาหาร, เงินเดือน"
                  />
                </label>
                <label>
                  วันที่
                  <input
                    type="date"
                    required
                    value={form.occurredAt}
                    onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
                  />
                </label>
                <label className="full">
                  หัวข้อ
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </label>
                <label className="full">
                  หมายเหตุ
                  <textarea
                    rows={2}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </label>
                {isAdmin && (
                  <label>
                    ผู้ใช้
                    <select
                      value={form.userId}
                      onChange={(e) => setForm({ ...form, userId: e.target.value })}
                    >
                      <option value="">ตัวเอง / ค่าเริ่มต้น</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="full">
                  รูปสลิป / หลักฐาน
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSlip(e.target.files?.[0] || null)}
                  />
                </label>
                {editing?.slipPath && (
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={form.clearSlip}
                      onChange={(e) => setForm({ ...form, clearSlip: e.target.checked })}
                    />
                    ลบรูปสลิปเดิม
                    {' · '}
                    <a href={slipUrl(editing.slipPath)} target="_blank" rel="noreferrer">
                      ดูรูปปัจจุบัน
                    </a>
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
