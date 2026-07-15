<script setup>
import { ref, onMounted } from 'vue'
import { api, formatDate, money } from '../api'
import { useAuth } from '../auth'

const { isAdmin } = useAuth()

const data = ref(null)
const error = ref('')

onMounted(() => {
  api
    .dashboard()
    .then((d) => {
      data.value = d
    })
    .catch((e) => {
      error.value = e.message
    })
})
</script>

<template>
  <div v-if="error" class="alert">{{ error }}</div>
  <div v-else-if="!data" class="boot">กำลังโหลดแดชบอร์ด...</div>
  <div v-else class="page">
    <header class="page-head">
      <div>
        <h1>แดชบอร์ด</h1>
        <p class="muted">สรุปรายรับรายจ่าย{{ isAdmin ? 'ทั้งระบบ' : 'ของคุณ' }}</p>
      </div>
    </header>

    <section class="stats">
      <article class="stat income">
        <span>รายรับ</span>
        <strong>฿{{ money(data.totalIncome) }}</strong>
        <small>{{ data.incomeCount }} รายการ</small>
      </article>
      <article class="stat expense">
        <span>รายจ่าย</span>
        <strong>฿{{ money(data.totalExpense) }}</strong>
        <small>{{ data.expenseCount }} รายการ</small>
      </article>
      <article class="stat balance" :class="data.balance >= 0 ? 'up' : 'down'">
        <span>คงเหลือ</span>
        <strong>฿{{ money(data.balance) }}</strong>
        <small>รายรับ − รายจ่าย</small>
      </article>
    </section>

    <div class="grid-2">
      <section class="panel">
        <h2>ตามหมวดหมู่</h2>
        <p v-if="data.byCategory.length === 0" class="muted">ยังไม่มีข้อมูล</p>
        <ul v-else class="bars">
          <li v-for="c in data.byCategory.slice(0, 8)" :key="`${c.type}-${c.category}`">
            <div class="bar-meta">
              <span>
                {{ c.category }}
                <em :class="c.type === 'income' ? 'tag-in' : 'tag-out'">
                  {{ c.type === 'income' ? 'รับ' : 'จ่าย' }}
                </em>
              </span>
              <span>฿{{ money(c.total) }}</span>
            </div>
            <div class="bar-track">
              <div
                class="bar-fill"
                :class="c.type"
                :style="{
                  width: `${(c.total / Math.max(...data.byCategory.map((x) => x.total), 1)) * 100}%`,
                }"
              />
            </div>
          </li>
        </ul>
      </section>

      <section class="panel">
        <h2>รายเดือน</h2>
        <p v-if="data.byMonth.length === 0" class="muted">ยังไม่มีข้อมูล</p>
        <ul v-else class="month-bars">
          <li v-for="m in data.byMonth" :key="m.month">
            <span class="month-label">{{ m.month }}</span>
            <div class="month-cols">
              <div
                class="m-col income"
                :style="{
                  height: `${
                    (m.income /
                      Math.max(...data.byMonth.flatMap((x) => [x.income, x.expense]), 1)) *
                    100
                  }%`,
                }"
                :title="`รับ ฿${money(m.income)}`"
              />
              <div
                class="m-col expense"
                :style="{
                  height: `${
                    (m.expense /
                      Math.max(...data.byMonth.flatMap((x) => [x.income, x.expense]), 1)) *
                    100
                  }%`,
                }"
                :title="`จ่าย ฿${money(m.expense)}`"
              />
            </div>
          </li>
        </ul>
      </section>
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
              <th v-if="isAdmin">ผู้ใช้</th>
              <th>ประเภท</th>
              <th class="num">จำนวน</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in data.recent" :key="t.id">
              <td>{{ formatDate(t.occurredAt) }}</td>
              <td>{{ t.title }}</td>
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
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
