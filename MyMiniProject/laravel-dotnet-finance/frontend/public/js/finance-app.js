(() => {
  'use strict'

  const API_BASE = (window.FINANCE_API || document.querySelector('meta[name="finance-api-url"]')?.content || 'http://localhost:5230').replace(/\/$/, '')
  const API = `${API_BASE}/api`

  const state = {
    user: null,
    loading: true,
    route: '/',
    modal: null,
  }

  const app = document.getElementById('app')

  function esc(s) {
    if (s == null) return ''
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  function money(n) {
    return Number(n || 0).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  function formatDate(d) {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function slipUrl(path) {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  }

  function authHeaders(isJson = true) {
    const h = {}
    if (isJson) h['Content-Type'] = 'application/json'
    const token = localStorage.getItem('token')
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

  const api = {
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

  function isAdmin() {
    return state.user?.role === 'admin'
  }

  function navigate(path, replace = false) {
    if (replace) {
      history.replaceState(null, '', path)
    } else {
      history.pushState(null, '', path)
    }
    state.route = normalizeRoute(path)
    render()
  }

  function normalizeRoute(path) {
    const p = path.split('?')[0].replace(/\/+$/, '') || '/'
    if (p === '/login') return '/login'
    if (p === '/transactions') return '/transactions'
    if (p === '/users') return '/users'
    return '/'
  }

  function logout() {
    localStorage.removeItem('token')
    state.user = null
    navigate('/login', true)
  }

  async function login(username, password) {
    const res = await api.login(username, password)
    localStorage.setItem('token', res.token)
    state.user = res.user
    navigate('/', true)
    return res.user
  }

  function closeModal() {
    state.modal = null
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())
  }

  function openModal(html, onMount) {
    closeModal()
    const wrap = document.createElement('div')
    wrap.className = 'modal-backdrop'
    wrap.innerHTML = html
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) closeModal()
    })
    document.body.appendChild(wrap)
    state.modal = wrap
    if (onMount) onMount(wrap)
  }

  function navLink(path, label, end = false) {
    const active = end ? state.route === '/' : state.route === path
    return `<a href="${path}" class="${active ? 'active' : ''}" data-nav="${path}">${esc(label)}</a>`
  }

  function renderLayout(content) {
    return `
      <div class="shell">
        <aside class="side">
          <div class="brand">
            <span class="brand-mark">฿</span>
            <div>
              <strong>Ledger</strong>
              <small>รายรับรายจ่าย</small>
            </div>
          </div>
          <nav>
            ${navLink('/', 'แดชบอร์ด', true)}
            ${navLink('/transactions', 'รายการ')}
            ${isAdmin() ? navLink('/users', 'ผู้ใช้') : ''}
          </nav>
          <div class="side-foot">
            <div class="who">
              <strong>${esc(state.user?.fullName)}</strong>
              <span>${state.user?.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}</span>
            </div>
            <button type="button" class="btn ghost" id="btn-logout">ออกจากระบบ</button>
          </div>
        </aside>
        <main class="main">${content}</main>
      </div>
    `
  }

  function renderLogin() {
    app.innerHTML = `
      <div class="login-page">
        <div class="login-visual" aria-hidden="true">
          <div class="login-orb"></div>
          <p class="login-tagline">บันทึกรายรับรายจ่าย พร้อมหลักฐานชัดเจน</p>
        </div>
        <form class="login-card" id="login-form">
          <h1>Ledger</h1>
          <p class="muted">เข้าสู่ระบบเพื่อจัดการการเงิน</p>
          <div id="login-error"></div>
          <label>
            ชื่อผู้ใช้
            <input name="username" value="admin" autocomplete="username" required>
          </label>
          <label>
            รหัสผ่าน
            <input name="password" type="password" value="admin123" autocomplete="current-password" required>
          </label>
          <button class="btn primary" type="submit">เข้าสู่ระบบ</button>
          <p class="hint">ทดลอง: <code>admin / admin123</code> หรือ <code>user / user123</code></p>
        </form>
      </div>
    `

    const form = document.getElementById('login-form')
    const errEl = document.getElementById('login-error')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      errEl.innerHTML = ''
      const btn = form.querySelector('button[type="submit"]')
      btn.disabled = true
      btn.textContent = 'กำลังเข้าสู่ระบบ...'
      try {
        await login(form.username.value, form.password.value)
      } catch (err) {
        errEl.innerHTML = `<div class="alert">${esc(err.message || 'เข้าสู่ระบบไม่สำเร็จ')}</div>`
      } finally {
        btn.disabled = false
        btn.textContent = 'เข้าสู่ระบบ'
      }
    })
  }

  async function renderDashboard() {
    app.innerHTML = renderLayout('<div class="boot">กำลังโหลดแดชบอร์ด...</div>')

    try {
      const data = await api.dashboard()
      const maxCat = Math.max(...data.byCategory.map((c) => c.total), 1)
      const maxMonth = Math.max(...data.byMonth.flatMap((m) => [m.income, m.expense]), 1)
      const admin = isAdmin()

      const categoryBars =
        data.byCategory.length === 0
          ? '<p class="muted">ยังไม่มีข้อมูล</p>'
          : `<ul class="bars">${data.byCategory
              .slice(0, 8)
              .map(
                (c) => `
              <li>
                <div class="bar-meta">
                  <span>${esc(c.category)} <em class="${c.type === 'income' ? 'tag-in' : 'tag-out'}">${c.type === 'income' ? 'รับ' : 'จ่าย'}</em></span>
                  <span>฿${money(c.total)}</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill ${c.type}" style="width:${(c.total / maxCat) * 100}%"></div>
                </div>
              </li>`,
              )
              .join('')}</ul>`

      const monthBars =
        data.byMonth.length === 0
          ? '<p class="muted">ยังไม่มีข้อมูล</p>'
          : `<ul class="month-bars">${data.byMonth
              .map(
                (m) => `
              <li>
                <span class="month-label">${esc(m.month)}</span>
                <div class="month-cols">
                  <div class="m-col income" style="height:${(m.income / maxMonth) * 100}%" title="รับ ฿${money(m.income)}"></div>
                  <div class="m-col expense" style="height:${(m.expense / maxMonth) * 100}%" title="จ่าย ฿${money(m.expense)}"></div>
                </div>
              </li>`,
              )
              .join('')}</ul>`

      const recentRows = data.recent
        .map(
          (t) => `
          <tr>
            <td>${formatDate(t.occurredAt)}</td>
            <td>${esc(t.title)}</td>
            <td>${esc(t.category)}</td>
            ${admin ? `<td>${esc(t.userName)}</td>` : ''}
            <td><span class="${t.type === 'income' ? 'tag-in' : 'tag-out'}">${t.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</span></td>
            <td class="num ${t.type}">${t.type === 'income' ? '+' : '-'}฿${money(t.amount)}</td>
          </tr>`,
        )
        .join('')

      app.innerHTML = renderLayout(`
        <div class="page">
          <header class="page-head">
            <div>
              <h1>แดชบอร์ด</h1>
              <p class="muted">สรุปรายรับรายจ่าย${admin ? 'ทั้งระบบ' : 'ของคุณ'}</p>
            </div>
          </header>
          <section class="stats">
            <article class="stat income">
              <span>รายรับ</span>
              <strong>฿${money(data.totalIncome)}</strong>
              <small>${data.incomeCount} รายการ</small>
            </article>
            <article class="stat expense">
              <span>รายจ่าย</span>
              <strong>฿${money(data.totalExpense)}</strong>
              <small>${data.expenseCount} รายการ</small>
            </article>
            <article class="stat balance ${data.balance >= 0 ? 'up' : 'down'}">
              <span>คงเหลือ</span>
              <strong>฿${money(data.balance)}</strong>
              <small>รายรับ − รายจ่าย</small>
            </article>
          </section>
          <div class="grid-2">
            <section class="panel"><h2>ตามหมวดหมู่</h2>${categoryBars}</section>
            <section class="panel"><h2>รายเดือน</h2>${monthBars}</section>
          </div>
          <section class="panel">
            <h2>รายการล่าสุด</h2>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>วันที่</th>
                    <th>หัวข้อ</th>
                    <th>หมวด</th>
                    ${admin ? '<th>ผู้ใช้</th>' : ''}
                    <th>ประเภท</th>
                    <th class="num">จำนวน</th>
                  </tr>
                </thead>
                <tbody>${recentRows}</tbody>
              </table>
            </div>
          </section>
        </div>
      `)
      bindShellEvents()
    } catch (e) {
      app.innerHTML = renderLayout(`<div class="alert">${esc(e.message)}</div>`)
      bindShellEvents()
    }
  }

  const txState = {
    items: [],
    users: [],
    filter: { type: '', category: '' },
    error: '',
    categoryTimer: null,
  }

  function openTransactionForm(editing = null) {
    const admin = isAdmin()
    const today = new Date().toISOString().slice(0, 10)
    const form = editing
      ? {
          type: editing.type,
          category: editing.category,
          title: editing.title,
          note: editing.note || '',
          amount: String(editing.amount),
          occurredAt: editing.occurredAt?.slice(0, 10) || today,
          userId: String(editing.userId),
          clearSlip: false,
        }
      : {
          type: 'expense',
          category: '',
          title: '',
          note: '',
          amount: '',
          occurredAt: today,
          userId: '',
          clearSlip: false,
        }

    const userOptions = txState.users
      .map((u) => `<option value="${u.id}" ${form.userId === String(u.id) ? 'selected' : ''}>${esc(u.fullName)}</option>`)
      .join('')

    openModal(
      `
      <form class="modal" id="tx-form">
        <h2>${editing ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}</h2>
        <div id="tx-form-error"></div>
        <div class="form-grid">
          <label>ประเภท
            <select name="type">
              <option value="income" ${form.type === 'income' ? 'selected' : ''}>รายรับ</option>
              <option value="expense" ${form.type === 'expense' ? 'selected' : ''}>รายจ่าย</option>
            </select>
          </label>
          <label>จำนวนเงิน
            <input name="amount" type="number" step="0.01" min="0.01" required value="${esc(form.amount)}">
          </label>
          <label>หมวดหมู่
            <input name="category" required value="${esc(form.category)}" placeholder="เช่น อาหาร, เงินเดือน">
          </label>
          <label>วันที่
            <input name="occurredAt" type="date" required value="${esc(form.occurredAt)}">
          </label>
          <label class="full">หัวข้อ
            <input name="title" required value="${esc(form.title)}">
          </label>
          <label class="full">หมายเหตุ
            <textarea name="note" rows="2">${esc(form.note)}</textarea>
          </label>
          ${
            admin
              ? `<label>ผู้ใช้
            <select name="userId">
              <option value="">ตัวเอง / ค่าเริ่มต้น</option>
              ${userOptions}
            </select>
          </label>`
              : ''
          }
          <label class="full">รูปสลิป / หลักฐาน
            <input name="slip" type="file" accept="image/*">
          </label>
          ${
            editing?.slipPath
              ? `<label class="check">
            <input name="clearSlip" type="checkbox">
            ลบรูปสลิปเดิม · <a href="${esc(slipUrl(editing.slipPath))}" target="_blank" rel="noreferrer">ดูรูปปัจจุบัน</a>
          </label>`
              : ''
          }
        </div>
        <div class="modal-actions">
          <button type="button" class="btn ghost" id="tx-cancel">ยกเลิก</button>
          <button type="submit" class="btn primary">บันทึก</button>
        </div>
      </form>
    `,
      (wrap) => {
        const formEl = wrap.querySelector('#tx-form')
        const errEl = wrap.querySelector('#tx-form-error')
        wrap.querySelector('#tx-cancel').addEventListener('click', closeModal)
        formEl.addEventListener('click', (e) => e.stopPropagation())
        formEl.addEventListener('submit', async (e) => {
          e.preventDefault()
          errEl.innerHTML = ''
          const btn = formEl.querySelector('button[type="submit"]')
          btn.disabled = true
          btn.textContent = 'กำลังบันทึก...'
          try {
            const fd = new FormData()
            fd.append('type', formEl.type.value)
            fd.append('category', formEl.category.value)
            fd.append('title', formEl.title.value)
            fd.append('note', formEl.note.value || '')
            fd.append('amount', formEl.amount.value)
            if (formEl.occurredAt.value) {
              fd.append('occurredAt', new Date(formEl.occurredAt.value).toISOString())
            }
            if (admin && formEl.userId?.value) fd.append('userId', formEl.userId.value)
            if (formEl.clearSlip?.checked) fd.append('clearSlip', 'true')
            if (formEl.slip.files[0]) fd.append('slip', formEl.slip.files[0])
            await api.saveTransaction(editing?.id, fd)
            closeModal()
            await loadTransactionsPage()
          } catch (err) {
            errEl.innerHTML = `<div class="alert">${esc(err.message)}</div>`
          } finally {
            btn.disabled = false
            btn.textContent = 'บันทึก'
          }
        })
      },
    )
  }

  async function loadTransactionsPage() {
    const admin = isAdmin()
    const focusedId = document.activeElement?.id
    const categorySelection =
      focusedId === 'filter-category' ? document.getElementById('filter-category')?.selectionStart : null
    try {
      txState.items = await api.getTransactions(txState.filter)
      txState.error = ''
    } catch (e) {
      txState.error = e.message
    }

    const rows =
      txState.items.length === 0
        ? `<tr><td colspan="${admin ? 8 : 7}" class="muted">ยังไม่มีรายการ</td></tr>`
        : txState.items
            .map(
              (t) => `
          <tr>
            <td>${formatDate(t.occurredAt)}</td>
            <td><strong>${esc(t.title)}</strong>${t.note ? `<div class="muted small">${esc(t.note)}</div>` : ''}</td>
            <td>${esc(t.category)}</td>
            ${admin ? `<td>${esc(t.userName)}</td>` : ''}
            <td><span class="${t.type === 'income' ? 'tag-in' : 'tag-out'}">${t.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</span></td>
            <td class="num ${t.type}">${t.type === 'income' ? '+' : '-'}฿${money(t.amount)}</td>
            <td>${
              t.slipPath
                ? `<a href="${esc(slipUrl(t.slipPath))}" target="_blank" rel="noreferrer" class="slip-link">ดูรูป</a>`
                : '<span class="muted">—</span>'
            }</td>
            <td class="actions">
              <button type="button" class="btn ghost sm" data-edit-tx="${t.id}">แก้ไข</button>
              <button type="button" class="btn danger sm" data-del-tx="${t.id}">ลบ</button>
            </td>
          </tr>`,
            )
            .join('')

    app.innerHTML = renderLayout(`
      <div class="page">
        <header class="page-head">
          <div>
            <h1>รายรับรายจ่าย</h1>
            <p class="muted">บันทึกรายการพร้อมรูปสลิปหรือหลักฐาน</p>
          </div>
          <button type="button" class="btn primary" id="btn-add-tx">+ เพิ่มรายการ</button>
        </header>
        <div class="filters">
          <select id="filter-type">
            <option value="" ${txState.filter.type === '' ? 'selected' : ''}>ทุกประเภท</option>
            <option value="income" ${txState.filter.type === 'income' ? 'selected' : ''}>รายรับ</option>
            <option value="expense" ${txState.filter.type === 'expense' ? 'selected' : ''}>รายจ่าย</option>
          </select>
          <input id="filter-category" placeholder="ค้นหาหมวดหมู่" value="${esc(txState.filter.category)}">
        </div>
        ${txState.error ? `<div class="alert">${esc(txState.error)}</div>` : ''}
        <div class="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>หัวข้อ</th>
                <th>หมวด</th>
                ${admin ? '<th>ผู้ใช้</th>' : ''}
                <th>ประเภท</th>
                <th class="num">จำนวน</th>
                <th>สลิป</th>
                <th></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `)

    bindShellEvents()
    document.getElementById('btn-add-tx').addEventListener('click', () => openTransactionForm())
    document.getElementById('filter-type').addEventListener('change', (e) => {
      txState.filter.type = e.target.value
      loadTransactionsPage()
    })
    document.getElementById('filter-category').addEventListener('input', (e) => {
      clearTimeout(txState.categoryTimer)
      txState.categoryTimer = setTimeout(() => {
        txState.filter.category = e.target.value
        loadTransactionsPage()
      }, 300)
    })
    if (focusedId === 'filter-category') {
      const input = document.getElementById('filter-category')
      input?.focus()
      if (categorySelection != null) input.setSelectionRange(categorySelection, categorySelection)
    }
    app.querySelectorAll('[data-edit-tx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = txState.items.find((x) => x.id === Number(btn.dataset.editTx))
        if (t) openTransactionForm(t)
      })
    })
    app.querySelectorAll('[data-del-tx]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('ลบรายการนี้?')) return
        try {
          await api.deleteTransaction(Number(btn.dataset.delTx))
          await loadTransactionsPage()
        } catch (e) {
          txState.error = e.message
          await loadTransactionsPage()
        }
      })
    })
  }

  async function renderTransactions() {
    app.innerHTML = renderLayout('<div class="boot">กำลังโหลด...</div>')
    bindShellEvents()
    if (isAdmin()) {
      try {
        txState.users = await api.getUsers()
      } catch {
        txState.users = []
      }
    }
    await loadTransactionsPage()
  }

  const userState = { users: [], error: '' }

  function openUserForm(editing = null) {
    const form = editing
      ? {
          username: editing.username,
          password: '',
          fullName: editing.fullName,
          email: editing.email || '',
          role: editing.role,
          isActive: editing.isActive,
        }
      : {
          username: '',
          password: '',
          fullName: '',
          email: '',
          role: 'user',
          isActive: true,
        }

    openModal(
      `
      <form class="modal" id="user-form">
        <h2>${editing ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้'}</h2>
        <div id="user-form-error"></div>
        <div class="form-grid">
          ${
            !editing
              ? `<label>Username
            <input name="username" required value="${esc(form.username)}">
          </label>`
              : ''
          }
          <label>รหัสผ่าน${editing ? ' (ว่าง = ไม่เปลี่ยน)' : ''}
            <input name="password" type="password" ${editing ? '' : 'required'} value="">
          </label>
          <label>ชื่อเต็ม
            <input name="fullName" required value="${esc(form.fullName)}">
          </label>
          <label>อีเมล
            <input name="email" type="email" value="${esc(form.email)}">
          </label>
          <label>บทบาท
            <select name="role">
              <option value="user" ${form.role === 'user' ? 'selected' : ''}>ผู้ใช้</option>
              <option value="admin" ${form.role === 'admin' ? 'selected' : ''}>ผู้ดูแล</option>
            </select>
          </label>
          ${
            editing
              ? `<label class="check">
            <input name="isActive" type="checkbox" ${form.isActive ? 'checked' : ''}> เปิดใช้งาน
          </label>`
              : ''
          }
        </div>
        <div class="modal-actions">
          <button type="button" class="btn ghost" id="user-cancel">ยกเลิก</button>
          <button type="submit" class="btn primary">บันทึก</button>
        </div>
      </form>
    `,
      (wrap) => {
        const formEl = wrap.querySelector('#user-form')
        const errEl = wrap.querySelector('#user-form-error')
        wrap.querySelector('#user-cancel').addEventListener('click', closeModal)
        formEl.addEventListener('click', (e) => e.stopPropagation())
        formEl.addEventListener('submit', async (e) => {
          e.preventDefault()
          errEl.innerHTML = ''
          const btn = formEl.querySelector('button[type="submit"]')
          btn.disabled = true
          btn.textContent = 'กำลังบันทึก...'
          try {
            if (editing) {
              await api.updateUser(editing.id, {
                fullName: formEl.fullName.value,
                email: formEl.email.value,
                role: formEl.role.value,
                isActive: formEl.isActive?.checked ?? true,
                password: formEl.password.value || null,
              })
            } else {
              await api.createUser({
                username: formEl.username.value,
                password: formEl.password.value,
                fullName: formEl.fullName.value,
                email: formEl.email.value,
                role: formEl.role.value,
              })
            }
            closeModal()
            await loadUsersPage()
          } catch (err) {
            errEl.innerHTML = `<div class="alert">${esc(err.message)}</div>`
          } finally {
            btn.disabled = false
            btn.textContent = 'บันทึก'
          }
        })
      },
    )
  }

  async function loadUsersPage() {
    try {
      userState.users = await api.getUsers()
      userState.error = ''
    } catch (e) {
      userState.error = e.message
    }

    const rows = userState.users
      .map(
        (u) => `
        <tr>
          <td><code>${esc(u.username)}</code></td>
          <td>${esc(u.fullName)}</td>
          <td>${u.email ? esc(u.email) : '—'}</td>
          <td>${u.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}</td>
          <td><span class="${u.isActive ? 'tag-in' : 'tag-out'}">${u.isActive ? 'ใช้งาน' : 'ปิด'}</span></td>
          <td>${formatDate(u.createdAt)}</td>
          <td class="actions">
            <button type="button" class="btn ghost sm" data-edit-user="${u.id}">แก้ไข</button>
            <button type="button" class="btn danger sm" data-del-user="${u.id}">ลบ</button>
          </td>
        </tr>`,
      )
      .join('')

    app.innerHTML = renderLayout(`
      <div class="page">
        <header class="page-head">
          <div>
            <h1>ผู้ใช้</h1>
            <p class="muted">จัดการบัญชีผู้ใช้ระบบ (เฉพาะ admin)</p>
          </div>
          <button type="button" class="btn primary" id="btn-add-user">+ เพิ่มผู้ใช้</button>
        </header>
        ${userState.error ? `<div class="alert">${esc(userState.error)}</div>` : ''}
        <div class="table-wrap panel">
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
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `)

    bindShellEvents()
    document.getElementById('btn-add-user').addEventListener('click', () => openUserForm())
    app.querySelectorAll('[data-edit-user]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const u = userState.users.find((x) => x.id === Number(btn.dataset.editUser))
        if (u) openUserForm(u)
      })
    })
    app.querySelectorAll('[data-del-user]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('ลบผู้ใช้นี้?')) return
        try {
          await api.deleteUser(Number(btn.dataset.delUser))
          await loadUsersPage()
        } catch (e) {
          userState.error = e.message
          await loadUsersPage()
        }
      })
    })
  }

  async function renderUsers() {
    if (!isAdmin()) {
      navigate('/', true)
      return
    }
    app.innerHTML = renderLayout('<div class="boot">กำลังโหลด...</div>')
    bindShellEvents()
    await loadUsersPage()
  }

  function bindShellEvents() {
    document.getElementById('btn-logout')?.addEventListener('click', logout)
    app.querySelectorAll('[data-nav]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        navigate(a.dataset.nav)
      })
    })
  }

  function render() {
    closeModal()

    if (state.loading) {
      app.innerHTML = '<div class="boot">กำลังโหลด...</div>'
      return
    }

    if (!state.user) {
      if (state.route !== '/login') {
        navigate('/login', true)
        return
      }
      renderLogin()
      return
    }

    if (state.route === '/login') {
      navigate('/', true)
      return
    }

    if (state.route === '/transactions') {
      renderTransactions()
      return
    }

    if (state.route === '/users') {
      renderUsers()
      return
    }

    renderDashboard()
  }

  async function initAuth() {
    const token = localStorage.getItem('token')
    if (!token) {
      state.loading = false
      return
    }
    try {
      state.user = await api.me()
    } catch {
      localStorage.removeItem('token')
      state.user = null
    } finally {
      state.loading = false
    }
  }

  window.addEventListener('popstate', () => {
    state.route = normalizeRoute(location.pathname)
    render()
  })

  document.addEventListener('DOMContentLoaded', async () => {
    state.route = normalizeRoute(location.pathname)
    await initAuth()
    render()
  })
})()
