import { useEffect, useState } from 'react'
import { api, formatDate, money } from '../api'
import { useAuth } from '../auth'

export default function DashboardPage() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

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

      <section className="panel">
        <h2>รายการล่าสุด</h2>
        <div className="table-wrap">
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
              {data.recent.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.occurredAt)}</td>
                  <td>{t.title}</td>
                  <td>{t.category}</td>
                  {isAdmin && <td>{t.userName}</td>}
                  <td>
                    <span className={t.type === 'income' ? 'tag-in' : 'tag-out'}>
                      {t.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                    </span>
                  </td>
                  <td className={`num ${t.type}`}>{t.type === 'income' ? '+' : '-'}฿{money(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
