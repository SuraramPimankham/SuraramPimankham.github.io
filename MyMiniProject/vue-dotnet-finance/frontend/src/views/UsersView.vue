<script setup>
import { ref, onMounted } from 'vue'
import { api, formatDate } from '../api'

const empty = () => ({
  username: '',
  password: '',
  fullName: '',
  email: '',
  role: 'user',
  isActive: true,
})

const users = ref([])
const form = ref(empty())
const editing = ref(null)
const showForm = ref(false)
const error = ref('')
const busy = ref(false)

async function load() {
  try {
    users.value = await api.getUsers()
  } catch (e) {
    error.value = e.message
  }
}

onMounted(() => {
  load()
})

function openCreate() {
  editing.value = null
  form.value = empty()
  showForm.value = true
  error.value = ''
}

function openEdit(u) {
  editing.value = u
  form.value = {
    username: u.username,
    password: '',
    fullName: u.fullName,
    email: u.email || '',
    role: u.role,
    isActive: u.isActive,
  }
  showForm.value = true
  error.value = ''
}

async function onSubmit(e) {
  e.preventDefault()
  busy.value = true
  error.value = ''
  try {
    if (editing.value) {
      await api.updateUser(editing.value.id, {
        fullName: form.value.fullName,
        email: form.value.email,
        role: form.value.role,
        isActive: form.value.isActive,
        password: form.value.password || null,
      })
    } else {
      await api.createUser({
        username: form.value.username,
        password: form.value.password,
        fullName: form.value.fullName,
        email: form.value.email,
        role: form.value.role,
      })
    }
    showForm.value = false
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function onDelete(id) {
  if (!confirm('ลบผู้ใช้นี้?')) return
  try {
    await api.deleteUser(id)
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
        <h1>ผู้ใช้</h1>
        <p class="muted">จัดการบัญชีผู้ใช้ระบบ (เฉพาะ admin)</p>
      </div>
      <button type="button" class="btn primary" @click="openCreate">+ เพิ่มผู้ใช้</button>
    </header>

    <div v-if="error && !showForm" class="alert">{{ error }}</div>

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
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td><code>{{ u.username }}</code></td>
            <td>{{ u.fullName }}</td>
            <td>{{ u.email || '—' }}</td>
            <td>{{ u.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้' }}</td>
            <td>
              <span :class="u.isActive ? 'tag-in' : 'tag-out'">
                {{ u.isActive ? 'ใช้งาน' : 'ปิด' }}
              </span>
            </td>
            <td>{{ formatDate(u.createdAt) }}</td>
            <td class="actions">
              <button type="button" class="btn ghost sm" @click="openEdit(u)">แก้ไข</button>
              <button type="button" class="btn danger sm" @click="onDelete(u.id)">ลบ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showForm" class="modal-backdrop" @click="showForm = false">
        <form class="modal" @click.stop @submit="onSubmit">
          <h2>{{ editing ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้' }}</h2>
          <div v-if="error" class="alert">{{ error }}</div>
          <div class="form-grid">
            <label v-if="!editing">
              Username
              <input v-model="form.username" required />
            </label>
            <label>
              รหัสผ่าน{{ editing ? ' (ว่าง = ไม่เปลี่ยน)' : '' }}
              <input
                v-model="form.password"
                type="password"
                :required="!editing"
              />
            </label>
            <label>
              ชื่อเต็ม
              <input v-model="form.fullName" required />
            </label>
            <label>
              อีเมล
              <input v-model="form.email" type="email" />
            </label>
            <label>
              บทบาท
              <select v-model="form.role">
                <option value="user">ผู้ใช้</option>
                <option value="admin">ผู้ดูแล</option>
              </select>
            </label>
            <label v-if="editing" class="check">
              <input v-model="form.isActive" type="checkbox" />
              เปิดใช้งาน
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
