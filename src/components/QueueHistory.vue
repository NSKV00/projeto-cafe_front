<template>
  <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
    <div class="d-flex align-center mb-3">
      <v-icon size="20">mdi-history</v-icon>
      <span class="ml-3 text-subtitle-2">Histórico da Fila</span>
    </div>

    <p class="text-caption mb-4 text-secondary">Últimas ações (compras ou cancelamentos)</p>

    <v-list dense nav class="history-list">
      <!-- Compras recentes -->
      <v-list-item v-for="(item, idx) in historyList" :key="idx">
        <v-list-item-avatar v-if="item.type === 'purchase'" color="var(--success-color)">
          <v-icon small>mdi-check</v-icon>
        </v-list-item-avatar>

        <v-list-item-avatar v-else-if="item.type === 'cancel'" color="var(--error-color)">
          <v-icon small>mdi-close</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-body-2">{{ item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <div class="mt-4" style="border-top: 1px solid var(--border-color); padding-top: 12px;">
      <div class="d-flex justify-space-between text-caption">
        <span>Exibindo {{ historyList.length }} registros</span>
        <span class="text-secondary">Últimas 24 horas</span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import compraService from '../services/compraService'
import filaService from '../services/filaService'

interface HistoryItem {
  name: string
  type: 'purchase' | 'cancel'
  timestamp?: string
}

const historyList = ref<HistoryItem[]>([])
const cardStyle = `
  background: var(--background-surface);
  border: 1px solid var(--border-color);
`

/**
 * Strategy:
 * - Get recent purchases from /compra (these are "purchase")
 * - Attempt to detect cancellations:
 *   * If API returns purchases with a 'deleted_at' or 'status: cancelled', mark them.
 *   * Otherwise, we cannot reliably fetch cancellations (requires backend endpoint).
 * - Keep only name (usuario.nome) and type.
 */

onMounted(async () => {
  try {
    // 1) purchases
    const comprasRes = await compraService.listar()
    const comprasData = comprasRes?.data?.data ?? comprasRes?.data ?? []

    const purchases = Array.isArray(comprasData) ? comprasData.map((c: any) => ({
      name: c.usuario?.nome ?? `#${c.usuario_id}`,
      type: ((c.deleted_at || c.status === 'cancelled') ? 'cancel' : 'purchase') as 'cancel' | 'purchase',
      timestamp: c.created_at ?? c.deleted_at ?? null
    })) : []

    // 2) Try to detect cancellations from fila deletions: fetch fila and compare?
    // Note: Backend does not expose trashed fila via routes by default — we can't rely on it.
    // We'll rely primarily on purchases; purchases that are soft-deleted could indicate cancellations.

    // Combine and deduplicate by name (most recent first)
    const combined = purchases.reverse() // newest first if created_at ascending
    // Build unique by name, keeping first occurrence
    const uniqueMap = new Map<string, HistoryItem>()
    for (const p of combined) {
      if (!uniqueMap.has(p.name)) uniqueMap.set(p.name, { name: p.name, type: p.type, timestamp: p.timestamp })
      if (uniqueMap.size >= 30) break // limit
    }

    historyList.value = Array.from(uniqueMap.values())
  } catch (err) {
    console.error('Erro ao carregar histórico', err)
  }
})
</script>

<style scoped>
.text-secondary {
  color: var(--text-secondary);
}
.history-list {
  max-height: 300px;
  overflow-y: auto;
}
</style>
