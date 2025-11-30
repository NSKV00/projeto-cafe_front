<template>
  <v-container fluid class="pa-6" style="min-height: 100vh; background: var(--background-main);">
    <!-- Topbar -->
    <v-row align="center" justify="space-between" class="mb-6">
      <v-col cols="12" md="6">
        <div>
          <h1 class="mb-0" :style="{ color: 'var(--text-primary)' }">Dashboard</h1>
          <p class="text-caption" :style="{ color: 'var(--text-secondary)' }">Visão geral do sistema — fila, compras e estoque</p>
        </div>
      </v-col>

      <v-col cols="12" md="6" class="d-flex justify-end align-center gap-3">
        <v-btn elevation="1" rounded text @click="refreshAll">
          <v-icon left>mdi-refresh</v-icon>
          Atualizar
        </v-btn>

        <v-btn elevation="1" rounded @click="toggleTheme">
          <v-icon left>mdi-theme-light-dark</v-icon>
          {{ isDark ? 'Modo Claro' : 'Modo Escuro' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Grid principal -->
    <v-row dense>

      <!-- COLUNA 1 (esquerda) - cards principais -->
      <v-col cols="12" lg="4" class="d-flex flex-column gap-4">
        <!-- Próximo na fila (destaque) -->
        <NextInQueue class="w-100"/>

        <!-- Compras Hoje -->
        <TodayStatsCard />

        <!-- Última Compra -->
        <LastPurchaseCard />
      </v-col>

      <!-- COLUNA 2 (meio) - tabela e histórico -->
      <v-col cols="12" lg="5" class="d-flex flex-column gap-4">
        <!-- Últimas Compras (lista detalhada) -->
        <RecentPurchasesList ref="recentPurchasesRef" />

        <!-- Histórico da fila -->
        <QueueHistory />
      </v-col>

      <!-- COLUNA 3 (direita) - status e estoque -->
      <v-col cols="12" lg="3" class="d-flex flex-column gap-4">
        <!-- Status da fila -->
        <QueueStatusCard />

        <!-- Controle de estoque -->
        <StockControl />
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

// Components
import NextInQueue from '../components/NextInQueue.vue'
import TodayStatsCard from '../components/TodayStatsCard.vue'
import LastPurchaseCard from '../components/LastPurchaseCard.vue'
import QueueStatusCard from '../components/QueueStatusCard.vue'
import QueueHistory from '../components/QueueHistory.vue'
import RecentPurchasesList from '../components/RecentPurchasesList.vue'
import StockControl from '../components/StockControl.vue'

// services (optional usage here)
import compraService from '../services/compraService'
import filaService from '../services/filaService'
import usuarioService from '../services/usuarioService'

const theme = useTheme()
const isDark = ref(theme.global.current.value.dark ?? false)

// Refs to child components (for refresh)
const recentPurchasesRef = ref<any>(null)

function toggleTheme() {
  // switch between our named themes
  const currentName = theme.global.name.value
  if (currentName === 'customTheme') {
    theme.global.name.value = 'customThemeDark'
    isDark.value = true
  } else {
    theme.global.name.value = 'customTheme'
    isDark.value = false
  }
}

/**
 * Tentativa de refresh enxuto:
 * - Dispara refresh local em components que expuserem métodos (ex: RecentPurchasesList.refresh).
 * - Como os componentes carregam dados no onMounted, preferimos chamar métodos expostos quando existirem.
 */
async function refreshAll() {
  // RecentPurchasesList expõe refresh() (implementado no componente)
  try {
    if (recentPurchasesRef.value && typeof recentPurchasesRef.value.refresh === 'function') {
      await recentPurchasesRef.value.refresh()
    } else {
      // fallback: re-fetch some endpoints to warm cache (no UI update if component doesn't expose)
      await Promise.all([
        compraService.listar().catch(() => {}),
        filaService.listar().catch(() => {}),
        usuarioService.listar().catch(() => {}),
      ])
    }
  } catch (err) {
    console.error('Erro ao atualizar dados', err)
  }
}
</script>

<style scoped>
/* espaçamentos finos para ficar bem com o tema */
.v-card {
  border-radius: 12px;
}

/* Responsividade extra */
@media (max-width: 960px) {
  .pa-6 {
    padding: 16px !important;
  }
}
</style>
