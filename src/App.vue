<template>
  <v-app class="app">
    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from './controller/api.controller'

const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('auth_token')

  if (token && router.currentRoute.value.path === '/login') {
    try {
      await api.post('/login/verificarToken')
      router.push('/')
    } catch {
      localStorage.removeItem('auth_token')
    }
  }
})
</script>

<style>
.app {
  width: 100%;
  margin: 0;
  padding: 0;
}

.main-content {
  padding: 0 !important;
}
</style>
