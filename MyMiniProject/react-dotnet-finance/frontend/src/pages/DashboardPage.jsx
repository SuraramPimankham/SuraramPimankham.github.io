import { useEffect, useMemo, useState } from 'react'
import { api, formatDate, money } from '../api'
import { useAuth } from '../auth'
import DataTable from '../components/DataTable'

const emptyFilter = {
  dateFrom: '',
  dateTo: '',
  title: '',
  category: '',
  user: '',
  type: '',
  amountFrom: '',
  amountTo: '',
}

export default function DashboardPage() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(emptyFilter)
  const [applied, setApplied] = useState(emptyFilter)

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  const recent = useMemo(() => {
    if (!data?.recent) return []
    const title = applied.title.trim().toLowerCase()
    const category = applied.category.trim().toLowerCase()
    const user = applied.user.trim().toLowerCase()
    const type = applied.type
    const dateFrom = applied.dateFrom
    const dateTo = applied.dateTo
    const amountFrom = applied.amountFrom === '' ? null : Number(applied.amountFrom)
    const amountTo = applied.amountTo === '' ? null : Number(applied.amountTo)
    return data.recent.filter((t) => {
      const day = t.occurredAt?.slice(0, 10) || ''
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (title && !t.title?.toLowerCase().includes(title)) return false
      if (category && !t.category?.toLowerCase().includes(category)) return false
      if (user && !t.userName?.toLowerCase().includes(user)) return false
      if (type && t.type !== type) return false
      const amt = Number(t.amount)
      if (amountFrom != null && !Number.isNaN(amountFrom) && amt < amountFrom) return false
      if (amountTo != null && !Number.isNaN(amountTo) && amt > amountTo) return false
      return true
    })
  }, [data, applied])

  function onSearch() {
    setApplied(draft)
  }

  function onClear() {
    setDraft(emptyFilter)
    setApplied(emptyFilter)
  }

  if (error) return <div className="alert">{error}</div>
  if (!data) return <div className="boot">กำลังโหลดแดชบอร์ด...</div>

  const maxCat = Math.max(...data.byCategory.map((c) => c.total), 1)
  const maxMonth = Math.max(...data.byMonth.flatMap((m) => [m.income, m.expense]), 1)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>แดชบอร์ด</h1>
          <p className="muted">สรุปรายรับรายจ่าย{isAdmin ? 'ทั้งระบบ' : 'ของคุณ'}</p>
        </div>
      </header>

      <section className="stats">
        <article className="stat income">
          <span>รายรับ</span>
          <strong>฿{money(data.totalIncome)}</strong>
          <small>{data.incomeCount} รายการ</small>
        </article>
        <article className="stat expense">
          <span>รายจ่าย</span>
          <strong>฿{money(data.totalExpense)}</strong>
          <small>{data.expenseCount} รายการ</small>
        </article>
        <article className={`stat balance ${data.balance >= 0 ? 'up' : 'down'}`}>
          <span>คงเหลือ</span>
          <strong>฿{money(data.balance)}</strong>
          <small>รายรับ − รายจ่าย</small>
        </article>
      </section>

      <div className="grid-2">
        <section className="panel">
          <h2>ตามหมวดหมู่</h2>
          {data.byCategory.length === 0 ? (
            <p className="muted">ยังไม่มีข้อมูล</p>
          ) : (
            <ul className="bars">
              {data.byCategory.slice(0, 8).map((c) => (
                <li key={`${c.type}-${c.category}`}>
                  <div className="bar-meta">
                    <span>
                      {c.category}{' '}
                      <em className={c.type === 'income' ? 'tag-in' : 'tag-out'}>
                        {c.type === 'income' ? 'รับ' : 'จ่าย'}
                      </em>
                    </span>
                    <span>฿{money(c.total)}</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${c.type}`}
                      style={{ width: `${(c.total / maxCat) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>รายเดือน</h2>
          {data.byMonth.length === 0 ? (
            <p className="muted">ยังไม่มีข้อมูล</p>
          ) : (
            <ul className="month-bars">
              {data.byMonth.map((m) => (
                <li key={m.month}>
                  <span className="month-label">{m.month}</span>
                  <div className="month-cols">
                    <div
                      className="m-col income"
                      style={{ height: `${(m.income / maxMonth) * 100}%` }}
                      title={`รับ ฿${money(m.income)}`}
                    />
                    <div
                      className="m-col expense"
                      style={{ height: `${(m.expense / maxMonth) * 100}%` }}
                      title={`จ่าย ฿${money(m.expense)}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <DataTable
        title="รายการล่าสุด"
        filters={
          <>
            <label className="data-table__filter g-span-3">
              <span>วันที่</span>
              <div className="data-table__range">
                <input
                  type="date"
                  value={draft.dateFrom}
                  onChange={(e) => setDraft((f) => ({ ...f, dateFrom: e.target.value }))}
                  aria-label="วันที่เริ่มต้น"
                />
                <span className="data-table__range-sep">ถึง</span>
                <input
                  type="date"
                  value={draft.dateTo}
                  onChange={(e) => setDraft((f) => ({ ...f, dateTo: e.target.value }))}
                  aria-label="วันที่สิ้นสุด"
                />
              </div>
            </label>
            <label className={`data-table__filter ${isAdmin ? 'g-span-2' : 'g-span-3'}`}>
              <span>หัวข้อ</span>
              <input
                type="search"
                placeholder="ค้นหา"
                value={draft.title}
                onChange={(e) => setDraft((f) => ({ ...f, title: e.target.value }))}
              />
            </label>
            <label className="data-table__filter g-span-2">
              <span>หมวด</span>
              <input
                type="search"
                placeholder="ค้นหา"
                value={draft.category}
                onChange={(e) => setDraft((f) => ({ ...f, category: e.target.value }))}
              />
            </label>
            {isAdmin && (
              <label className="data-table__filter g-span-2">
                <span>ผู้ใช้</span>
                <input
                  type="search"
                  placeholder="ค้นหา"
                  value={draft.user}
                  onChange={(e) => setDraft((f) => ({ ...f, user: e.target.value }))}
                />
              </label>
            )}
            <label className="data-table__filter g-span-1">
              <span>ประเภท</span>
              <select
                value={draft.type}
                onChange={(e) => setDraft((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="">ทั้งหมด</option>
                <option value="income">รายรับ</option>
                <option value="expense">รายจ่าย</option>
              </select>
            </label>
            <label className={`data-table__filter ${isAdmin ? 'g-span-2' : 'g-span-3'}`}>
              <span>จำนวน</span>
              <div className="data-table__range">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="ต่ำสุด"
                  value={draft.amountFrom}
                  onChange={(e) => setDraft((f) => ({ ...f, amountFrom: e.target.value }))}
                  aria-label="จำนวนเริ่มต้น"
                />
                <span className="data-table__range-sep">ถึง</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="สูงสุด"
                  value={draft.amountTo}
                  onChange={(e) => setDraft((f) => ({ ...f, amountTo: e.target.value }))}
                  aria-label="จำนวนสิ้นสุด"
                />
              </div>
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
              <th>วันที่</th>
              <th>หัวข้อ</th>
              <th>หมวด</th>
              {isAdmin && <th>ผู้ใช้</th>}
              <th>ประเภท</th>
              <th className="num">จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="data-table__empty">
                  ยังไม่มีรายการ
                </td>
              </tr>
            ) : (
              recent.map((t) => (
                <tr key={t.id}>
                  <td className="data-table__date">{formatDate(t.occurredAt)}</td>
                  <td className="data-table__title">{t.title}</td>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
