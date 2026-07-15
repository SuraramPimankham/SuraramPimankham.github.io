<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../auth'

const { user, logout, isAdmin } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
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
        <RouterLink to="/" custom v-slot="{ href, navigate, isExactActive }">
          <a :href="href" :class="{ active: isExactActive }" @click="navigate">แดชบอร์ด</a>
        </RouterLink>
        <RouterLink to="/transactions" active-class="active">รายการ</RouterLink>
        <RouterLink v-if="isAdmin" to="/users" active-class="active">ผู้ใช้</RouterLink>
      </nav>
      <div class="side-foot">
        <div class="who">
          <strong>{{ user?.fullName }}</strong>
          <span>{{ user?.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้' }}</span>
        </div>
        <button type="button" class="btn ghost" @click="handleLogout">ออกจากระบบ</button>
      </div>
    </aside>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
