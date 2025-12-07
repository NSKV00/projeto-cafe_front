<template>
  <v-app class="dashboard-app">
    <v-app-bar class="dashboard-header" flat elevation="1" height="92">
      <v-container fluid class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <img :src="Logo" alt="CoffeeQueue" class="logo-img header-logo" />
        </div>

        <div class="d-flex align-center gap-2">

          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                v-longpress
                icon
                size="small"
                @click="refreshAll"
                title="Atualizar dados"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Atualizar</span>
          </v-tooltip>

          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                v-longpress
                icon
                size="small"
                @click="toggleTheme"
                :title="isDark ? 'Modo Claro' : 'Modo Escuro'"
              >
                <v-icon>
                  {{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}
                </v-icon>
              </v-btn>
            </template>
            <span>{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </v-tooltip>

          <v-tooltip v-if="isAdmin" location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                v-longpress
                small
                outlined
                color="primary"
                class="mr-2"
                @click="goToAdmin"
                title="Painel Admin"
              >
                <v-icon left>mdi-shield-account</v-icon>
                Admin
              </v-btn>
            </template>
            <span>Painel Admin</span>
          </v-tooltip>

          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                v-longpress
                icon
                size="small"
                @click="goToProfile"
                title="Perfil"
              >
                <v-avatar size="36">
                  <v-icon>mdi-account-circle</v-icon>
                </v-avatar>
              </v-btn>
            </template>
            <span>Perfil</span>
          </v-tooltip>
        </div>
      </v-container>
    </v-app-bar>

      <v-main class="dashboard-main">
        <v-container fluid class="pa-6">
          <v-row align="center" justify="space-between" class="mb-6">
            <v-col cols="12" md="8">
              <div>
                <h2 class="text-h5 mb-2" :style="{ color: 'var(--text-primary)' }">Dashboard</h2>
              </div>
            </v-col>

            <v-col cols="12" md="4" class="d-flex justify-center">
              <v-sheet class="pa-3 rounded-lg" :style="statusSheetStyle">
                <div class="d-flex align-center gap-2">
                  <v-icon small>mdi-database-sync</v-icon>
                  <span class="text-caption">Última atualização: {{ lastUpdate }}</span>
                </div>
              </v-sheet>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" lg="4" class="d-flex flex-column gap-4">
              <v-card class="pa-5 rounded-xl" :style="featuredStyle" elevation="3">
                <div class="d-flex align-center mb-4">
                  <v-icon color="white" size="28">mdi-account</v-icon>
                  <span class="ml-3 text-white text-body-2 font-weight-bold">Próximo da Fila</span>
                </div>

                <div v-if="fila && fila.usuario" class="mb-6">
                  <div class="d-flex align-center">
                    <v-avatar size="56" color="white" class="mr-4" style="opacity: 0.25">
                      <span class="text-h4">1</span>
                    </v-avatar>
                    <div>
                      <p class="text-h5 text-white mb-1">{{ fila.usuario.nome }}</p>
                    </div>
                  </div>
                </div>

                <div v-else class="mb-6 pa-4 rounded-lg" style="background: rgba(255,255,255,0.1);">
                  <p class="text-white text-body-2 mb-0">Ninguém na fila no momento</p>
                </div>

                <div v-if="queuePreview.length > 0" class="pt-4" style="border-top: 1px solid rgba(255,255,255,0.2)">
                  <p class="text-caption text-white mb-3">Próximos na fila:</p>
                  <div class="d-flex flex-wrap justify-space-between gap-2">
                    <v-card
                      v-for="(person, idx) in queuePreview"
                      :key="idx"
                      class="queue-card pa-3 text-center"
                    >
                      <v-avatar size="32" color="white" class="mb-2" style="opacity: 0.25">
                        <span class="text-body-2">{{ idx + 2 }}</span>
                      </v-avatar>
                      <p class="text-caption text-white mb-0">{{ person.usuario?.nome || 'Usuário' }}</p>
                    </v-card>
                  </div>
                </div>
              </v-card>

              <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
                <div class="d-flex align-center mb-3">
                  <v-icon size="22" color="var(--color-secondary)">mdi-coffee</v-icon>
                  <span class="ml-3 text-subtitle-2">Compras Hoje</span>
                </div>

                <div>
                  <p class="text-h3 mb-1 font-weight-bold">{{ stats.total }}</p>

                  <div class="d-flex align-center gap-2">
                    <v-icon
                      size="18"
                      :color="stats.percent >= 0 ? 'var(--success-color)' : 'var(--error-color)'"
                    >
                      {{ stats.percent >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>

                    <span :style="{ color: stats.percent >= 0 ? 'var(--success-color)' : 'var(--error-color)' }">
                      {{ Math.abs(stats.percent).toFixed(1) }}%
                    </span>
                    <span class="text-secondary text-caption">vs. ontem</span>
                  </div>
                </div>
              </v-card>

              <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="2">
                <div class="d-flex align-center mb-3">
                  <v-icon size="22" color="var(--success-color)">mdi-shopping</v-icon>
                  <span class="ml-3 text-subtitle-2">Última Compra</span>
                </div>

                <div v-if="last" class="mb-3">
                  <p class="text-body-1 mb-1" :style="{ color: 'var(--text-primary)', fontWeight: '600' }">
                    {{ last.usuario?.nome }}
                  </p>
                  <p class="text-secondary text-caption mb-2">
                    <strong>Café:</strong> {{ last.cafe_qnd ?? 0 }} | <strong>Filtro:</strong> {{ last.filtro_qnd ?? 0 }}
                  </p>
                </div>

                <div v-if="last" class="pt-3" style="border-top: 1px solid var(--border-color)">
                  <span class="text-caption text-secondary">{{ formatTime(last.created_at) }}</span>
                </div>

                <div v-else class="text-center text-caption text-secondary py-6">
                  Nenhuma compra registrada ainda
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" lg="5" class="d-flex flex-column gap-4">
              <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center gap-2">
                    <v-icon size="20">mdi-coffee</v-icon>
                    <span class="text-subtitle-2">Últimas Compras</span>
                  </div>
                  <v-btn small text @click="loadPurchases" size="small">
                    <v-icon size="18">mdi-refresh</v-icon>
                  </v-btn>
                </div>

                <p class="text-caption mb-4 text-secondary">Cliente • Café • Filtro • Horário</p>

                <v-list density="compact" class="recent-list">
                  <v-list-item v-for="purchase in purchases.slice(0, 8)" :key="purchase.id">
                    <template #prepend>
                      <v-avatar color="var(--color-secondary)" size="32">
                        <v-icon small>mdi-check-circle</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="text-body-2">
                      {{ purchase.usuario?.nome ?? `#${purchase.usuario_id}` }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="text-caption text-secondary">
                      ☕ {{ purchase.cafe_qnd ?? 0 }} | 📄 {{ purchase.filtro_qnd ?? 0 }}
                    </v-list-item-subtitle>

                    <template #append>
                      <span class="text-caption text-secondary ml-3">
                        {{ formatTime(purchase.created_at) }}
                      </span>
                    </template>
                  </v-list-item>

                  <v-list-item v-if="purchases.length === 0">
                    <v-list-item-title class="text-caption text-secondary text-center w-100">
                      Nenhuma compra registrada
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-color)">
                  <div class="d-flex justify-space-between text-caption">
                    <span>Total: {{ purchases.length }} compras</span>
                    <span class="text-secondary">Mostrando: 8 primeiras</span>
                  </div>
                </div>
              </v-card>

              <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
                <div class="d-flex align-center mb-3">
                  <v-icon size="20">mdi-history</v-icon>
                  <span class="ml-3 text-subtitle-2">Histórico da Fila</span>
                </div>

                <p class="text-caption mb-4 text-secondary">Últimas ações (compras ou cancelamentos)</p>

                <v-list density="compact" class="history-list">
                  <v-list-item v-for="(item, idx) in historyList" :key="idx">
                    <template #prepend>
                      <v-avatar
                        v-if="item.type === 'purchase'"
                        color="var(--success-color)"
                        size="32"
                      >
                        <v-icon small>mdi-check</v-icon>
                      </v-avatar>

                      <v-avatar v-else-if="item.type === 'cancel'" color="var(--error-color)" size="32">
                        <v-icon small>mdi-close</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="text-body-2">{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption text-secondary">
                      {{ item.type === 'purchase' ? 'Compra' : 'Cancelamento' }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="historyList.length === 0">
                    <v-list-item-title class="text-caption text-secondary text-center w-100">
                      Sem ações recentes
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-color)">
                  <div class="d-flex justify-space-between text-caption">
                    <span>{{ historyList.length }} registros</span>
                    <span class="text-secondary">Últimas 24h</span>
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" lg="3" class="d-flex flex-column gap-4">
              <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="2">
                <div class="d-flex align-center mb-3">
                  <v-icon size="20">mdi-account-group</v-icon>
                  <span class="ml-3 text-subtitle-2">Status da Fila</span>
                </div>

                <div class="mb-4">
                  <p class="text-h3 mb-1 font-weight-bold">{{ totalInQueue }}</p>
                  <p class="text-body-2 text-secondary mb-0">{{ statusText }}</p>
                </div>

                <div class="d-flex flex-column gap-3 pt-3" style="border-top: 1px solid var(--border-color)">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption">Usuários ativos</span>
                    <span class="text-body-2 font-weight-bold">{{ totalActiveUsers }}</span>
                  </div>

                  <div class="d-flex justify-space-between align-center">
                    <span class="text-caption">Entraram nos últimos 5min</span>
                    <v-chip size="small" variant="outlined" color="var(--color-primary)">
                      +{{ recentJoins }}
                    </v-chip>
                  </div>

                  <div
                    class="pa-3 rounded-lg mt-2"
                    :style="{ background: getStatusColor(), opacity: 0.1 }"
                  >
                    <p class="text-caption mb-0" :style="{ color: getStatusColor() }">
                      {{ getStatusDescription() }}
                    </p>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useTheme } from 'vuetify'
  import { toast } from 'vue3-toastify'
  import Logo from '../assets/LogoCoffeeQueue.png'
  import compraService from '../services/compraService'
  import filaService from '../services/filaService'

  const router = useRouter()
  const theme = useTheme()
  const isDark = ref<boolean>(theme.global.current.value.dark ?? false)
  function readIsAdmin(): boolean {
    if (localStorage.getItem('is_admin') === '1') return true

    if (localStorage.getItem('acesso') === 'admin') return true

    const userStr = localStorage.getItem('user') || localStorage.getItem('usuario')
    if (userStr) {
      try {
        const u = JSON.parse(userStr)
        if (u && (u.acesso === 'admin' || String(u.is_admin) === '1' || u.is_admin === true)) return true
      } catch {}
    }

    return false
  }

  const isAdmin = ref<boolean>(readIsAdmin())

  const fila = ref<any>({})
  const queueList = ref<any[]>([])
  const recentJoins = ref<number>(0)

  const purchases = ref<any[]>([])
  const last = ref<any | null>(null)

  const stats = ref({
    total: 0,
    percent: 0,
  })

  const historyList = ref<{ name: string; type: 'purchase' | 'cancel'; timestamp?: string | null }[]>([])

  const lastUpdate = ref<string>('--:--')

  const featuredStyle = `
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    border: 2px solid var(--color-primary-dark);
  `

  const cardStyle = `
    background: var(--background-surface);
    border: 1px solid var(--border-color);
  `

  const statusSheetStyle = `
    background: var(--background-surface);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
  `

  const queuePreview = computed(() => {
    if (!Array.isArray(queueList.value)) return []
    return queueList.value.slice(1, 5)
  })

  const storageHandler = () => {
    isAdmin.value = readIsAdmin()
  }

  const totalInQueue = computed(() => queueList.value.length)
  const totalActiveUsers = computed(() => queueList.value.length)

  const statusText = computed(() => {
    const n = totalInQueue.value
    if (n <= 5) return 'Fluxo Normal'
    if (n <= 10) return 'Moderado'
    return 'Fila Longa'
  })

  function formatTime(iso?: string | null): string {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function updateLastUpdate(): void {
    const now = new Date()
    lastUpdate.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function getStatusColor(): string {
    const n = totalInQueue.value
    if (n <= 5) return 'var(--success-color)'
    if (n <= 10) return 'var(--warning-color)'
    return 'var(--error-color)'
  }

  function getStatusDescription(): string {
    const n = totalInQueue.value
    if (n === 0) return 'Fila vazia - ninguém aguardando'
    if (n <= 5) return 'Fluxo normal - atendimento rápido'
    if (n <= 10) return 'Moderado - fila em crescimento'
    return 'Fila longa - considere múltiplos atendentes'
  }

  function toggleTheme(): void {
    const currentName = theme.global.name.value
    if (currentName === 'customTheme') {
      theme.global.name.value = 'customThemeDark'
      isDark.value = true
      document.documentElement.classList.add('dark-theme')
      localStorage.setItem('is_dark', '1')
    } else {
      theme.global.name.value = 'customTheme'
      isDark.value = false
      document.documentElement.classList.remove('dark-theme')
      localStorage.removeItem('is_dark')
    }
  }

  function goToProfile(): void {
    router.push('/perfil')
  }

  function goToAdmin(): void {
    router.push('/admin')
  }

  async function loadFila(): Promise<void> {
    try {
      const res = await filaService.listar()
      const data = res?.data?.data ?? res?.data ?? []

      if (Array.isArray(data) && data.length > 0) {
        fila.value = data[0]
      } else if (data && typeof data === 'object') {
        fila.value = data
      } else {
        fila.value = {}
      }
    } catch (err) {
      console.error('Erro ao carregar fila:', err)
      fila.value = {}
    }
  }

  async function loadQueueList(): Promise<void> {
    try {
      const res = await filaService.listar()
      const data = res?.data?.data ?? res?.data ?? []
      queueList.value = Array.isArray(data) ? data : []
      const now = Date.now()
      recentJoins.value = queueList.value.filter((q: any) => {
        if (!q.created_at) return false
        const created = new Date(q.created_at).getTime()
        return now - created <= 20 * 60 * 1000
      }).length
    } catch (err) {
      console.error('Erro ao carregar lista da fila:', err)
      queueList.value = []
      recentJoins.value = 0
    }
  }

  async function loadPurchases(): Promise<void> {
    try {
      const res = await compraService.listar()
      const data = res?.data?.data ?? res?.data ?? []
      purchases.value = Array.isArray(data) ? data : []

      last.value = purchases.value.length > 0 ? purchases.value[0] : null

      const now = new Date()
      const today = purchases.value.filter((c: any) => {
        if (!c.created_at) return false
        const d = new Date(c.created_at)
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        )
      })
      stats.value.total = today.length

      const yesterdayDate = new Date(now)
      yesterdayDate.setDate(now.getDate() - 1)
      const yesterday = purchases.value.filter((c: any) => {
        if (!c.created_at) return false
        const d = new Date(c.created_at)
        return (
          d.getDate() === yesterdayDate.getDate() &&
          d.getMonth() === yesterdayDate.getMonth() &&
          d.getFullYear() === yesterdayDate.getFullYear()
        )
      })

      stats.value.percent =
        yesterday.length === 0 ? 100 : ((today.length - yesterday.length) / (yesterday.length || 1)) * 100
    } catch (err) {
      console.error('Erro ao carregar compras:', err)
      purchases.value = []
      last.value = null
      stats.value = { total: 0, percent: 0 }
    }
  }

  async function loadHistory(): Promise<void> {
    try {
      const res = await compraService.listar()
      const data = res?.data?.data ?? res?.data ?? []
      const compras = Array.isArray(data) ? data.slice() : []

      compras.sort((a: any, b: any) => {
        const da = new Date(a.created_at || a.deleted_at || 0).getTime()
        const db = new Date(b.created_at || b.deleted_at || 0).getTime()
        return db - da
      })

      const items: { name: string; type: 'purchase' | 'cancel'; timestamp?: string | null }[] = []

      for (const c of compras) {
        if (!c) continue
        const name = c.usuario?.nome ?? `#${c.usuario_id ?? '—'}`
        const type = c.deleted_at ? 'cancel' : 'purchase'
        const timestamp = c.deleted_at ?? c.created_at ?? null
        items.push({ name, type, timestamp })
        if (items.length >= 30) break
      }

      historyList.value = items
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
      historyList.value = []
    }
  }

  async function refreshAll(): Promise<void> {
    try {
      toast.info('Atualizando dados...')
      updateLastUpdate()

      await Promise.allSettled([loadFila(), loadQueueList(), loadPurchases(), loadHistory()])

      toast.success('Dados atualizados com sucesso!')
    } catch (err) {
      console.error('Erro ao atualizar dados:', err)
      toast.error('Erro ao atualizar dados')
    }
  }

  onMounted(() => {
    isAdmin.value = readIsAdmin()
    window.addEventListener('storage', storageHandler)
    if (localStorage.getItem('is_dark') === '1') {
      document.documentElement.classList.add('dark-theme')
      theme.global.name.value = 'customThemeDark'
      isDark.value = true
    } else {
      document.documentElement.classList.remove('dark-theme')
      theme.global.name.value = 'customTheme'
      isDark.value = false
    }
    updateLastUpdate()
    void refreshAll()
  })

  onUnmounted(() => {
    window.removeEventListener('storage', storageHandler)
  })
</script>

<style scoped>
  .text-secondary { color: var(--text-secondary); }

  .header-logo { height: 64px; cursor: pointer; }

  .logo-img, .header-logo {
    height: 64px;
    max-height: 64px;
    width: auto;
    object-fit: contain;
  }

  .dashboard-header .v-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .dashboard-header .d-flex {
    flex-wrap: wrap;
  }

  @media (max-width: 960px) {
    .logo-img, .header-logo {
      height: 56px;
      max-height: 56px;
    }
  }

  @media (max-width: 600px) {
    .logo-img, .header-logo {
      height: 48px;
      max-height: 48px;
    }

    .dashboard-header .v-container {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    .dashboard-app .v-app-bar {
      height: auto !important;
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }

  @media (min-width: 315px) and (max-width: 380px) {
    .dashboard-header .v-container {
      padding-left: 6px;
      padding-right: 6px;
      gap: 6px;
    }

    .dashboard-header .d-flex {
      gap: 6px;
      flex-wrap: wrap;
      align-items: center;
    }

    .logo-img, .header-logo {
      height: 48px;
      max-height: 48px;
    }

    .dashboard-header h2.text-h6 {
      font-size: 1rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .dashboard-header p.text-caption {
      display: none;
    }

    .dashboard-header .d-flex > div:last-child {
      flex: 1;
      min-width: 0;
    }

    .dashboard-header .v-btn {
      padding: 4px;
      min-width: 36px;
    }

    .v-app-bar.dashboard-header {
      overflow-x: hidden;
    }
  }

  @media (min-width: 315px) and (max-width: 400px) {
    .dashboard-header .v-container {
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
    }

    .dashboard-header .d-flex {
      justify-content: center;
      align-items: center;
    }

    .logo-img, .header-logo {
      margin: 0 auto;
    }
  }
</style>
