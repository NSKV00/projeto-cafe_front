<template>
  <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="2">
    <div class="d-flex align-center mb-3">
      <v-icon size="20">{{ icon }}</v-icon>
      <span class="ml-3 text-subtitle-2">Status da Fila</span>
    </div>

    <div class="mb-3">
      <p class="text-h3 mb-1">{{ totalInQueue }}</p>
      <p class="text-body-2 text-secondary">{{ statusText }}</p>
    </div>

    <v-row class="pt-3" style="border-top: 1px solid var(--border-color)">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <div class="text-caption">Usuários ativos na fila</div>
        <div class="text-body-2">{{ totalActiveUsers }}</div>
      </v-col>

      <v-col cols="12" class="d-flex align-center justify-space-between">
        <div class="text-caption">Entraram nos últimos 5min</div>
        <div class="text-body-2">+{{ recentJoins }}</div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import filaService from '../services/filaService'
//import { mdiAccountGroup } from '@mdi/js'

const icon = 'mdi-account-group'

const queueList = ref<any[]>([])
const recentJoins = ref<number>(0)

const cardStyle = `
  background: var(--background-surface);
  border: 1px solid var(--border-color);
`

onMounted(async () => {
  try {
    const res = await filaService.listar()
    // Assumindo formato ResponseService -> { data: [...] } ou { data: { ... } }
    // Nós verificamos e normalizamos.
    const data = res?.data?.data ?? res?.data ?? []
    queueList.value = Array.isArray(data) ? data : []

    // recentJoins — tentativa simples: usuários com 'created_at' nos últimos 5 minutos
    const now = new Date()
    recentJoins.value = queueList.value.filter((q: any) => {
      if (!q.created_at) return false
      const created = new Date(q.created_at)
      return (now.getTime() - created.getTime()) <= 5 * 60 * 1000
    }).length
  } catch (err) {
    console.error('Erro ao carregar fila', err)
  }
})

const totalInQueue = computed(() => queueList.value.length)
const totalActiveUsers = computed(() => queueList.value.length) // no backend "ativos" == lista retornada
const statusText = computed(() => {
  const n = totalInQueue.value
  if (n <= 5) return 'Fluxo Normal'
  if (n <= 10) return 'Moderado'
  return 'Fila Longa'
})
</script>

<style scoped>
.text-secondary {
  color: var(--text-secondary);
}
</style>
