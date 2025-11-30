<template>
  <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="2">
    <div class="d-flex align-center mb-3">
      <v-icon size="22" color="var(--success-color)">mdi-shopping</v-icon>
      <span class="ml-3 text-subtitle-2">Última Compra</span>
    </div>

    <div v-if="last" class="mb-3">
      <p class="text-body-1 text-primary"><strong>{{ last.usuario?.nome }}</strong></p>
      <p class="text-secondary text-caption">
        Café: {{ last.cafe_qnd }} • Filtro: {{ last.filtro_qnd }}
      </p>
    </div>

    <div v-if="last" class="pt-3" style="border-top: 1px solid var(--border-color)">
      <span class="text-caption text-secondary">{{ formatTime(last.created_at) }}</span>
    </div>

    <div v-else class="text-center text-caption text-secondary">
      Nenhuma compra registrada ainda.
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import compraService from '../services/compraService'

const last = ref<any | null>(null)

const cardStyle = `
  background: var(--background-surface);
  border: 1px solid var(--border-color);
`

onMounted(async () => {
  const res = await compraService.listar()
  const data = res?.data?.data ?? res?.data ?? []

  if (Array.isArray(data) && data.length > 0) {
    last.value = data[0] // backend já ordena por created_at desc
  }
})

function formatTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.text-primary {
  color: var(--text-primary);
}
.text-secondary {
  color: var(--text-secondary);
}
</style>
