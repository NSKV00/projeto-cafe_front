<template>
  <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
    <div class="d-flex align-center mb-3">
      <v-icon size="20">mdi-coffee</v-icon>
      <span class="ml-3 text-subtitle-2">Últimas Compras</span>
    </div>

    <p class="text-caption mb-4 text-secondary">Exibe cliente + quantidade de café e filtros</p>

    <v-list class="recent-list" dense>
      <v-list-item v-for="purchase in purchases" :key="purchase.id">
        <v-list-item-avatar color="var(--color-secondary)">
          <v-icon small>mdi-check-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-body-2">{{ purchase.usuario?.nome ?? `#${purchase.usuario_id}` }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption text-secondary">
            Café: <strong>{{ purchase.cafe_qnd ?? 0 }}</strong> — Filtro: <strong>{{ purchase.filtro_qnd ?? 0 }}</strong>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action-text class="text-caption text-secondary">
          {{ formatTime(purchase.created_at) }}
        </v-list-item-action-text>
      </v-list-item>
    </v-list>

    <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-color)">
      <div class="d-flex justify-space-between text-caption">
        <span>Total: {{ purchases.length }} compras</span>
        <v-btn small text @click="refresh">Atualizar</v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import compraService from '../services/compraService'

const purchases = ref<any[]>([])
const cardStyle = `
  background: var(--background-surface);
  border: 1px solid var(--border-color);
`

onMounted(load)
async function load() {
  try {
    const res = await compraService.listar()
    const data = res?.data?.data ?? res?.data ?? []
    // Keep most recent first (backend orders by created_at desc)
    purchases.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Erro ao buscar compras', err)
  }
}

function refresh() {
  load()
}

function formatTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.text-secondary {
  color: var(--text-secondary);
}
.recent-list {
  max-height: 420px;
  overflow-y: auto;
}
</style>
