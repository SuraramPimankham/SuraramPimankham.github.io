<script setup>
import { authState } from './auth'
</script>

<template>
  <div v-if="authState.loading" class="boot">กำลังโหลด...</div>
  <RouterView v-else />
</template>
