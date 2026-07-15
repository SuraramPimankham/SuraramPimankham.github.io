<script setup>
import { ref, watch, onMounted } from 'vue'
import { api, formatDate, money, slipUrl } from '../api'
import { useAuth } from '../auth'

const emptyForm = () => ({
  type: 'expense',
  category: '',
  title: '',
  note: '',
  amount: '',
  occurredAt: new Date().toISOString().slice(0, 10),
  userId: '',
  clearSlip: false,
})

const { isAdmin } = useAuth()

const items = ref([])
const users = ref([])
const filter = ref({ type: '', category: '' })
const form = ref(emptyForm())
const slip = ref(null)
const editing = ref(null)
const error = ref('')
const busy = ref(false)
const showForm = ref(false)

async function load() {
  try {
    items.value = await api.getTransactions(filter.value)
  } catch (e) {
    error.value = e.message
  }
}

watch(
  () => [filter.value.type, filter.value.category],
  () => {
    load()
  },
)

onMounted(() => {
  load()
  if (isAdmin) {
    api.getUsers().then((u) => {
      users.value = u
    }).catch(() => {})
  }
})

function openCreate() {
  editing.value = null
  form.value = emptyForm()
  slip.value = null
  showForm.value = true
  error.value = ''
}

function openEdit(t) {
  editing.value = t
  form.value = {
    type: t.type,
    category: t.category,
    title: t.title,
    note: t.note || '',
    amount: String(t.amount),
    occurredAt: t.occurredAt?.slice(0, 10) || '',
    userId: String(t.userId),
    clearSlip: false,
  }
  slip.value = null
  showForm.value = true
  error.value = ''
}

function onSlipChange(e) {
  slip.value = e.target.files?.[0] || null
}

async function onSubmit(e) {
  e.preventDefault()
  busy.value = true
  error.value = ''
  try {
    const fd = new FormData()
    fd.append('type', form.value.type)
    fd.append('category', form.value.category)
    fd.append('title', form.value.title)
    fd.append('note', form.value.note || '')
    fd.append('amount', form.value.amount)
    if (form.value.occurredAt) {
      fd.append('occurredAt', new Date(form.value.occurredAt).toISOString())
    }
    if (isAdmin && form.value.userId) fd.append('userId', form.value.userId)
    if (form.value.clearSlip) fd.append('clearSlip', 'true')
    if (slip.value) fd.append('slip', slip.value)

    await api.saveTransaction(editing.value?.id, fd)
    showForm.value = false
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function onDelete(id) {
  if (!confirm('ลบรายการนี้?')) return
  try {
    await api.deleteTransaction(id)
    await load()
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>รายรับรายจ่าย</h1>
        <p class="muted">บันทึกรายการพร้อมรูปสลิปหรือหลักฐาน</p>
      </div>
      <button type="button" class="btn primary" @click="openCreate">+ เพิ่มรายการ</button>
    </header>

    <div class="filters">
      <select v-model="filter.type">
        <option value="">ทุกประเภท</option>
        <option value="income">รายรับ</option>
        <option value="expense">รายจ่าย</option>
      </select>
      <input
        v-model="filter.category"
        placeholder="ค้นหาหมวดหมู่"
      />
    </div>

    <div v-if="error && !showForm" class="alert">{{ error }}</div>

    <div class="table-wrap panel">
      <table>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>หัวข้อ</th>
            <th>หมวด</th>
            <th v-if="isAdmin">ผู้ใช้</th>
            <th>ประเภท</th>
            <th class="num">จำนวน</th>
            <th>สลิป</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="items.length === 0">
            <td :colspan="isAdmin ? 8 : 7" class="muted">ยังไม่มีรายการ</td>
          </tr>
          <tr v-for="t in items" :key="t.id">
            <td>{{ formatDate(t.occurredAt) }}</td>
            <td>
              <strong>{{ t.title }}</strong>
              <div v-if="t.note" class="muted small">{{ t.note }}</div>
            </td>
            <td>{{ t.category }}</td>
            <td v-if="isAdmin">{{ t.userName }}</td>
            <td>
              <span :class="t.type === 'income' ? 'tag-in' : 'tag-out'">
                {{ t.type === 'income' ? 'รายรับ' : 'รายจ่าย' }}
              </span>
            </td>
            <td class="num" :class="t.type">
              {{ t.type === 'income' ? '+' : '-' }}฿{{ money(t.amount) }}
            </td>
            <td>
              <a
                v-if="t.slipPath"
                :href="slipUrl(t.slipPath)"
                target="_blank"
                rel="noreferrer"
                class="slip-link"
              >
                ดูรูป
              </a>
              <span v-else class="muted">—</span>
            </td>
            <td class="actions">
              <button type="button" class="btn ghost sm" @click="openEdit(t)">แก้ไข</button>
              <button type="button" class="btn danger sm" @click="onDelete(t.id)">ลบ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click="showForm = false">
        <form class="modal" @click.stop @submit="onSubmit">
          <h2>{{ editing ? 'แก้ไขรายการ' : 'เพิ่มรายการ' }}</h2>
          <div v-if="error" class="alert">{{ error }}</div>
          <div class="form-grid">
            <label>
              ประเภท
              <select v-model="form.type">
                <option value="income">รายรับ</option>
                <option value="expense">รายจ่าย</option>
              </select>
            </label>
            <label>
              จำนวนเงิน
              <input
                v-model="form.amount"
                type="number"
                step="0.01"
                min="0.01"
                required
              />
            </label>
            <label>
              หมวดหมู่
              <input
                v-model="form.category"
                required
                placeholder="เช่น อาหาร, เงินเดือน"
              />
            </label>
            <label>
              วันที่
              <input v-model="form.occurredAt" type="date" required />
            </label>
            <label class="full">
              หัวข้อ
              <input v-model="form.title" required />
            </label>
            <label class="full">
              หมายเหตุ
              <textarea v-model="form.note" rows="2" />
            </label>
            <label v-if="isAdmin">
              ผู้ใช้
              <select v-model="form.userId">
                <option value="">ตัวเอง / ค่าเริ่มต้น</option>
                <option v-for="u in users" :key="u.id" :value="u.id">
                  {{ u.fullName }}
                </option>
              </select>
            </label>
            <label class="full">
              รูปสลิป / หลักฐาน
              <input type="file" accept="image/*" @change="onSlipChange" />
            </label>
            <label v-if="editing?.slipPath" class="check">
              <input v-model="form.clearSlip" type="checkbox" />
              ลบรูปสลิปเดิม
              ·
              <a :href="slipUrl(editing.slipPath)" target="_blank" rel="noreferrer">
                ดูรูปปัจจุบัน
              </a>
            </label>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn ghost" @click="showForm = false">ยกเลิก</button>
            <button type="submit" class="btn primary" :disabled="busy">
              {{ busy ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </form>
      </div>
    </Teleport>
  </div>
</template>
