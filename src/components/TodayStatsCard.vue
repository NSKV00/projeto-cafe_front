<template>
  <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
    <div class="d-flex align-center mb-3">
      <v-icon size="22" color="var(--color-secondary)">mdi-coffee</v-icon>
      <span class="ml-3 text-subtitle-2">Compras Hoje</span>
    </div>

    <div>
      <p class="text-h4 mb-1">{{ stats.total }}</p>

      <div class="d-flex align-center ga-2">
        <v-icon
          size="18"
          color="green"
        >
          mdi-trending-up
        </v-icon>

        <span class="text-success">{{ stats.percent }}%</span>
        <span class="text-secondary text-caption">vs. ontem</span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import compraService from '../services/compraService'

const cardStyle = `
  background: var(--background-surface);
  border: 1px solid var(--border-color);
`

const stats = ref({
  total: 0,
  percent: 0,
})

onMounted(async () => {
  const res = await compraService.listar()
  const all = res?.data?.data ?? res?.data ?? []

  const today = all.filter((c: any) => {
    if (!c.created_at) return false
    const d = new Date(c.created_at)
    const now = new Date()
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  })

  stats.value.total = today.length

  // Comparação simplificada com "ontem"
  const yesterday = all.filter((c: any) => {
    if (!c.created_at) return false
    const d = new Date(c.created_at)
    const now = new Date()
    const yesterdayDate = new Date(now)
    yesterdayDate.setDate(now.getDate() - 1)
    return (
      d.getDate() === yesterdayDate.getDate() &&
      d.getMonth() === yesterdayDate.getMonth() &&
      d.getFullYear() === yesterdayDate.getFullYear()
    )
  })

  stats.value.percent =
    yesterday.length === 0 ? 100 : ((today.length - yesterday.length) / yesterday.length) * 100
})
</script>

<style scoped>
.text-secondary {
  color: var(--text-secondary);
}

.text-success {
  color: var(--success-color);
}
</style>
