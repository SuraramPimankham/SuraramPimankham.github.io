<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth'

const { user, login, loading } = useAuth()
const router = useRouter()

const username = ref('admin')
const password = ref('admin123')
const error = ref('')
const busy = ref(false)

watch(
  () => [loading, user],
  () => {
    if (!loading && user) router.replace('/')
  },
  { immediate: true },
)

async function onSubmit(e) {
  e.preventDefault()
  error.value = ''
  busy.value = true
  try {
    await login(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.message || 'เข้าสู่ระบบไม่สำเร็จ'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div v-if="loading" class="boot">กำลังโหลด...</div>
  <div v-else-if="!user" class="login-page">
    <div class="login-visual" aria-hidden="true">
      <div class="login-orb" />
      <p class="login-tagline">บันทึกรายรับรายจ่าย พร้อมหลักฐานชัดเจน</p>
    </div>
    <form class="login-card" @submit="onSubmit">
      <h1>Ledger</h1>
      <p class="muted">เข้าสู่ระบบเพื่อจัดการการเงิน</p>
      <div v-if="error" class="alert">{{ error }}</div>
      <label>
        ชื่อผู้ใช้
        <input v-model="username" autocomplete="username" required />
      </label>
      <label>
        รหัสผ่าน
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>
      <button class="btn primary" :disabled="busy" type="submit">
        {{ busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>
      <p class="hint">
        ทดลอง: <code>admin / admin123</code> หรือ <code>user / user123</code>
      </p>
    </form>
  </div>
</template>
