<template>
  <v-app class="dashboard-app">
    <v-app-bar class="dashboard-header" flat elevation="1" height="92">
      <v-container fluid class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3" style="cursor:pointer" @click="goHome">
          <img :src="Logo" alt="CoffeeQueue" class="logo-img header-logo" />
        </div>

        <div class="d-flex align-center gap-2">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon size="small" @click="refreshAll" title="Atualizar dados">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Atualizar</span>
          </v-tooltip>

          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon size="small" @click="toggleTheme" :title="isDark ? 'Modo Claro' : 'Modo Escuro'">
                <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
              </v-btn>
            </template>
            <span>{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </v-tooltip>

          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" v-longpress icon size="small" @click="goToProfile" title="Perfil">
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
                    <h2 class="text-h5 mb-2" :style="{ color: 'var(--text-primary)' }">Admin Dashboard</h2>
                </div>
                </v-col>
            </v-row>

            <v-row dense>
            <v-col cols="12" lg="6">
                <v-card class="pa-4 rounded-xl" :style="cardStyle">
                <div class="d-flex align-center mb-3">
                    <v-icon size="20">mdi-account-multiple</v-icon>
                    <span class="ml-3 text-subtitle-2">Usuários</span>
                    <v-spacer />
                    <v-btn small text @click="loadUsers">Recarregar</v-btn>
                </div>

                <div class="d-flex align-center mb-3" style="gap:8px; flex-wrap:wrap">
                    <v-text-field dense hide-details placeholder="Pesquisar nome ou email" v-model="userFilter" @keyup.enter="applyUserFilter" style="max-width:240px"></v-text-field>
                    <v-btn small text @click="applyUserFilter">Filtrar</v-btn>
                    <v-btn small text @click="clearUserFilter">Limpar</v-btn>
                </div>

                <div class="table-responsive users-table">
                    <v-simple-table dense>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Último login</th>
                        <th>Admin</th>
                        <th>Entradas</th>
                        <th class="text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="u in users" :key="u.id">
                        <td data-label="Nome">{{ u.nome ?? '—' }}</td>
                        <td data-label="Email">{{ u.email ?? '—' }}</td>
                        <td data-label="Último login">{{ u.ultimo_login ? formatTime(u.ultimo_login) : '—' }}</td>
                        <td data-label="Admin">
                        <v-chip small :color="u.is_admin ? 'primary' : undefined">
                            {{ u.is_admin ? 'Sim' : 'Não' }}
                        </v-chip>
                        </td>
                        <td data-label="Entradas">{{ u.total_compras ?? '-' }}</td>
                        <td data-label="Ações" class="text-right">
                        <v-tooltip>
                            <template #activator="{ props }">
                            <v-btn v-bind="props" small icon @click="fetchUserDetails(u)"><v-icon>mdi-information-outline</v-icon></v-btn>
                            </template>
                            <span>Detalhes</span>
                        </v-tooltip>

                        <v-btn small text :loading="loading.toggleAdmin && togglingUserId === u.id" @click="toggleAdmin(u)">{{ u.is_admin ? 'Remover admin' : 'Tornar admin' }}</v-btn>
                        <v-btn small text color="primary" :loading="loading.restoreUser && restoringUserId === u.id" @click="restoreUser(u)">Restaurar</v-btn>
                        <v-btn small text color="error" :loading="loading.destroyUser && destroyingUserId === u.id" @click="confirmDestroyUser(u)">Excluir definitivo</v-btn>
                        </td>
                    </tr>

                    <tr v-if="users.length === 0">
                        <td colspan="5" class="text-center text-caption text-secondary">Nenhum usuário</td>
                    </tr>
                    </tbody>
                    </v-simple-table>
                </div>
                </v-card>
            </v-col>

            <v-col cols="12" lg="6">
                <v-card class="pa-4 rounded-xl" :style="cardStyle">
                <div class="d-flex align-center mb-3">
                    <v-icon size="20">mdi-format-list-bulleted</v-icon>
                    <span class="ml-3 text-subtitle-2">Fila</span>
                    <v-spacer />
                    <v-btn small text @click="loadFila">Recarregar</v-btn>
                </div>

                <v-list dense>
                    <v-list-item v-for="f in filaList" :key="f.id">
                    <v-list-item-content>
                        <v-list-item-title>{{ f.posicao }} — {{ f.usuario?.nome ?? `#${f.usuario_id}` }}</v-list-item-title>
                        <v-list-item-subtitle class="text-caption text-secondary">{{ formatTime(f.created_at) }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn small text color="info" @click="verPosicaoFila(f)">Ver posição</v-btn>
                        <v-btn small text color="error" @click="confirmRemoveFila(f)">Remover</v-btn>
                    </v-list-item-action>
                    </v-list-item>

                    <v-list-item v-if="filaList.length === 0">
                    <v-list-item-title class="text-caption text-secondary">Fila vazia</v-list-item-title>
                    </v-list-item>
                </v-list>
                </v-card>
            </v-col>
            </v-row>

            <v-row dense class="mt-4">
            <v-col cols="12" lg="6">
                <v-card class="pa-4 rounded-xl" :style="cardStyle">
                <div class="d-flex align-center mb-3">
                    <v-icon size="20">mdi-shopping</v-icon>
                    <span class="ml-3 text-subtitle-2">Compras</span>
                    <v-spacer />
                    <v-btn small text @click="loadCompras">Recarregar</v-btn>
                </div>

                <div class="table-responsive compras-table">
                    <v-simple-table dense>
                    <thead>
                    <tr>
                        <th>Usuário</th>
                        <th>Café</th>
                        <th>Filtro</th>
                        <th>Horário</th>
                        <th class="text-right">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="c in compras" :key="c.id">
                        <td data-label="Usuário">{{ c.usuario?.nome ?? `#${c.usuario_id}` }}</td>
                        <td data-label="Café">{{ c.cafe_qnd ?? 0 }}</td>
                        <td data-label="Filtro">{{ c.filtro_qnd ?? 0 }}</td>
                        <td data-label="Horário">{{ formatTime(c.created_at) }}</td>
                        <td data-label="Ações" class="text-right compras-actions">
                            <v-tooltip>
                            <template #activator="{ props }">
                                <v-btn v-bind="props" small icon @click="openEditCompra(c)"><v-icon>mdi-pencil</v-icon></v-btn>
                            </template>
                            <span>Editar</span>
                            </v-tooltip>

                            <v-tooltip>
                            <template #activator="{ props }">
                                <v-btn v-bind="props" small icon color="primary" @click="restoreCompra(c)"><v-icon>mdi-backup-restore</v-icon></v-btn>
                            </template>
                            <span>Restaurar</span>
                            </v-tooltip>

                            <v-tooltip>
                            <template #activator="{ props }">
                                <v-btn v-bind="props" small icon color="error" @click="confirmDestroyCompra(c)"><v-icon>mdi-delete-outline</v-icon></v-btn>
                            </template>
                            <span>Excluir definitivo</span>
                            </v-tooltip>
                        </td>
                    </tr>

                    <tr v-if="compras.length === 0">
                        <td colspan="5" class="text-center text-caption text-secondary">Nenhuma compra</td>
                    </tr>
                    </tbody>
                    </v-simple-table>
                </div>
                </v-card>
            </v-col>
            </v-row>

            <v-row dense class="mt-4">
            <v-col cols="12" lg="6">
                <v-card class="pa-4 rounded-xl" :style="cardStyle">
                <div class="d-flex align-center mb-3">
                    <v-icon size="20">mdi-file-document-outline</v-icon>
                    <span class="ml-3 text-subtitle-2">Logs</span>
                    <v-spacer />
                    <v-btn small text @click="loadLogs">Recarregar</v-btn>
                </div>

                <div class="d-flex align-center mb-3" style="gap:8px; flex-wrap:wrap">
                    <v-select dense :items="usersForFilter" item-title="nome" item-value="id" v-model="logsFilter.usuarioId" label="Usuário" clearable style="max-width:220px"></v-select>
                    <v-text-field dense type="date" v-model="logsFilter.start" label="Início"></v-text-field>
                    <v-text-field dense type="date" v-model="logsFilter.end" label="Fim"></v-text-field>
                    <v-btn small text @click="applyLogsFilter">Filtrar</v-btn>
                    <v-btn small text @click="clearLogsFilter">Limpar</v-btn>
                    <v-btn small text color="primary" :loading="loading.exportReport" @click="exportReport">Exportar (periodo)</v-btn>
                </div>

                    <div style="max-height:320px; overflow:auto">
                        <v-list dense>
                            <div class="logs-responsive table-responsive">
                                <v-list-item v-for="l in logs" :key="l.id" class="logs-item">
                                    <v-list-item-content>
                                        <div class="d-flex align-center justify-space-between logs-row">
                                        <div>
                                            <v-list-item-title class="font-weight-medium">{{ l.usuario?.nome ?? `#${l.usuario_id}` }}</v-list-item-title>
                                            <v-list-item-subtitle class="text-caption text-secondary">{{ formatLogShort(l.data_evento) }}</v-list-item-subtitle>
                                        </div>
                                        <div class="logs-actions">
                                            <v-btn small text @click="fetchUserDetails(l.usuario)">Usuário</v-btn>
                                            <v-btn small text @click="console.log(l)">Raw</v-btn>
                                        </div>
                                        </div>

                                        <div style="margin-top:8px; font-size:0.9rem; color:var(--text-secondary);" class="logs-meta">
                                        <div><strong>ID:</strong> {{ l.id }}</div>
                                        <div><strong>Usuario ID:</strong> {{ l.usuario_id }}</div>
                                        <div><strong>Email:</strong> {{ l.usuario?.email ?? '—' }}</div>
                                        <div><strong>Evento:</strong> {{ l.tipo_evento ?? '—' }}</div>
                                        <div><strong>Data evento:</strong> {{ l.data_evento }}</div>
                                        </div>
                                    </v-list-item-content>
                                    </v-list-item>
                                <v-list-item v-if="logs.length === 0"><v-list-item-title class="text-caption text-secondary">Sem logs</v-list-item-title></v-list-item>
                            </div>
                        </v-list>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" lg="6">
                <v-card class="pa-4 rounded-xl" :style="cardStyle">
                <div class="d-flex align-center mb-3">
                    <v-icon size="20">mdi-account-circle</v-icon>
                    <span class="ml-3 text-subtitle-2">Relatórios e usuários</span>
                    <v-spacer />
                    <v-btn small text @click="loadUsersActive">Usuários ativos</v-btn>
                </div>

                <div class="reports-summary">
                    <v-row class="w-100" align="center" justify="space-around">
                    <v-col cols="12" sm="4" class="text-center">
                        <div class="text-caption">Usuários ativos</div>
                        <div class="text-h6">{{ summary.ativos ?? '-' }}</div>
                    </v-col>
                    <v-col cols="12" sm="4" class="text-center">
                        <div class="text-caption">Relatório (último período)</div>
                        <div class="text-h6">{{ summary.relatorio ?? '-' }}</div>
                    </v-col>
                    <v-col cols="12" sm="4" class="text-center">
                        <div class="text-caption">Total usuários</div>
                        <div class="text-h6">{{ users.length ?? '-' }}</div>
                    </v-col>
                    </v-row>
                </div>
                </v-card>
            </v-col>
            </v-row>
        </v-container>
    </v-main>

    <v-dialog v-model="dialog.confirmDeleteUser" width="480">
      <v-card>
        <v-card-title>Confirmar exclusão de usuário</v-card-title>
        <v-card-text>Excluir usuário selecionado? A ação é soft delete.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog.confirmDeleteUser = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteUser" :loading="loading.deleteUser">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.confirmRemoveFila" width="480">
      <v-card>
        <v-card-title>Remover da fila</v-card-title>
        <v-card-text>Remover entrada da fila selecionada?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog.confirmRemoveFila = false">Cancelar</v-btn>
          <v-btn color="error" @click="removeFila" :loading="loading.removeFila">Remover</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.confirmDeleteCompra" width="480">
      <v-card>
        <v-card-title>Excluir compra</v-card-title>
        <v-card-text>Confirmar exclusão da compra? (soft delete)</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog.confirmDeleteCompra = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteCompra" :loading="loading.deleteCompra">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.confirmDestroyUser" width="480">
      <v-card>
        <v-card-title>Excluir usuário definitivamente</v-card-title>
        <v-card-text>Esta ação removerá o usuário permanentemente. Deseja continuar?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog.confirmDestroyUser = false">Cancelar</v-btn>
          <v-btn color="error" @click="destroyUser" :loading="loading.destroyUser">Excluir definitivo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.confirmDestroyCompra" width="480">
      <v-card>
        <v-card-title>Excluir compra definitivamente</v-card-title>
        <v-card-text>Esta ação removerá a compra permanentemente. Deseja continuar?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog.confirmDestroyCompra = false">Cancelar</v-btn>
          <v-btn color="error" @click="destroyCompra" :loading="loading.destroyCompra">Excluir definitivo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="userDetailsDialog" max-width="640">
      <v-card>
        <v-card-title>Detalhes do usuário</v-card-title>
        <v-card-text>
          <div v-if="userDetails">
            <p><strong>Nome:</strong> {{ userDetails.nome }}</p>
            <p><strong>Email:</strong> {{ userDetails.email }}</p>
            <p><strong>Admin:</strong> {{ userDetails.is_admin ? 'Sim' : 'Não' }}</p>
            <p><strong>Entradas:</strong> {{ userDetails.total_compras ?? 0 }}</p>
            <p><strong>Último login:</strong> {{ userDetails.ultimo_login ?? '-' }}</p>
            <pre style="white-space:pre-wrap">{{ JSON.stringify(userDetails, null, 2) }}</pre>
          </div>
          <div v-else>Carregando...</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="userDetailsDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="compraEditDialog" max-width="520">
      <v-card>
        <v-card-title>Editar compra</v-card-title>
        <v-card-text>
          <v-text-field dense label="Café (quantidade)" v-model="compraForm.cafe_qnd" type="number"></v-text-field>
          <v-text-field dense label="Filtro (quantidade)" v-model="compraForm.filtro_qnd" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="compraEditDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveEditCompra" :loading="loading.saveCompra">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useTheme } from 'vuetify'
    import { toast } from 'vue3-toastify'

    import Logo from '../assets/LogoCoffeeQueue.png'
    import api from '../controller/api.controller'
    import usuarioService from '../services/usuarioService'
    import filaService from '../services/filaService'
    import compraService from '../services/compraService'

    const router = useRouter()
    const theme = useTheme()

    const isDark = ref<boolean>(theme.global.current.value.dark ?? false)

    function goToProfile() { router.push('/perfil') }
    function toggleTheme() {
    const currentName = theme.global.name.value
    if (currentName === 'customTheme') {
        theme.global.name.value = 'customThemeDark'
        document.documentElement.classList.add('dark-theme')
        isDark.value = true
        localStorage.setItem('is_dark', '1')
    } else {
        theme.global.name.value = 'customTheme'
        document.documentElement.classList.remove('dark-theme')
        isDark.value = false
        localStorage.removeItem('is_dark')
    }
    }

    function goHome() { router.push('/') }

    const cardStyle = `
    background: var(--background-surface);
    border: 1px solid var(--border-color);
    `

    const users = ref<any[]>([])
    const filaList = ref<any[]>([])
    const compras = ref<any[]>([])

    const dialog = ref({
    confirmDeleteUser: false,
    confirmRemoveFila: false,
    confirmDeleteCompra: false,
    confirmDestroyUser: false,
    confirmDestroyCompra: false,
    })
    const loading = ref({
    deleteUser: false,
    removeFila: false,
    deleteCompra: false,
    toggleAdmin: false,
    destroyUser: false,
    destroyCompra: false,
    saveCompra: false,
    restoreUser: false,
    lastLogins: false,
    loadLogs: false,
    exportReport: false,
    })

    const selectedUser = ref<any | null>(null)
    const selectedFila = ref<any | null>(null)
    const selectedCompra = ref<any | null>(null)
    const userFilter = ref<string>('')
    const userDetailsDialog = ref(false)
    const userDetails = ref<any | null>(null)

    const compraEditDialog = ref(false)
    const compraForm = ref<any>({ id: null, cafe_qnd: 0, filtro_qnd: 0 })

    const togglingUserId = ref<number | null>(null)
    const restoringUserId = ref<number | null>(null)
    const destroyingUserId = ref<number | null>(null)

    const logs = ref<any[]>([])
    const logsFilter = ref<{ usuarioId?: number | null; start?: string | null; end?: string | null }>({ usuarioId: null, start: null, end: null })
    const usersForFilter = computed(() => users.value.map(u => ({ id: u.id, nome: u.nome })))
    const summary = ref<{ ativos?: number | string; online?: number | string; relatorio?: any }>({})

    function normalizeUser(u: any) {
    if (!u || typeof u !== 'object') return u
    const normalized = { ...u }
    normalized.is_admin = Boolean(
        normalized.is_admin === 1 ||
        normalized.is_admin === '1' ||
        normalized.is_admin === true ||
        String(normalized.is_admin) === '1' ||
        normalized.acesso === 'admin' ||
        normalized.acesso === 'ADMIN'
    )
    return normalized
    }

    onMounted(async () => {
    // Initialize theme from localStorage so dark mode persists across reloads
    try {
      const storedDark = localStorage.getItem('is_dark') === '1'
      if (storedDark) {
        theme.global.name.value = 'customThemeDark'
        document.documentElement.classList.add('dark-theme')
        isDark.value = true
      } else {
        theme.global.name.value = 'customTheme'
        document.documentElement.classList.remove('dark-theme')
        isDark.value = false
      }
    } catch (e) { /* ignore */ }
    const isAdminLocal = localStorage.getItem('is_admin') === '1'
    if (!isAdminLocal) {
        try {
        const res = await api.get('/login/verificarToken')
        const payload = res?.data?.data ?? res?.data ?? {}
        const user = payload.usuario ?? payload.user ?? payload ?? {}
        const userIsAdmin = Boolean(user?.is_admin === 1 || user?.is_admin === true || user?.acesso === 'admin')
        if (!user || !userIsAdmin) {
            toast.error('Acesso negado: área administrativa')
            router.push('/')
            return
        } else {
            localStorage.setItem('is_admin', userIsAdmin ? '1' : '0')
        }
        } catch (err) {
        console.error('Token verification error', err)
        toast.error('Acesso negado')
        router.push('/')
        return
        }
    }
    await refreshAll()
    })

    async function loadUsers() {
    try {
        const res = await usuarioService.listar()
        const data = res?.data?.data ?? res?.data ?? []
        users.value = Array.isArray(data) ? data.map(d => normalizeUser(d)) : []
    } catch (err) {
        console.error('Erro ao carregar usuários', err)
        users.value = []
        toast.error('Erro ao carregar usuários')
    }
    }

    async function loadFila() {
    try {
        const res = await filaService.listar()
        const data = res?.data?.data ?? res?.data ?? []
        filaList.value = Array.isArray(data) ? data : []
    } catch (err) {
        console.error('Erro ao carregar fila', err)
        filaList.value = []
        toast.error('Erro ao carregar fila')
    }
    }

    async function loadCompras() {
    try {
        const res = await compraService.listar()
        const data = res?.data?.data ?? res?.data ?? []
        compras.value = Array.isArray(data) ? data : []
    } catch (err) {
        console.error('Erro ao carregar compras', err)
        compras.value = []
        toast.error('Erro ao carregar compras')
    }
    }

    async function refreshAll() {
    try {
        toast.info('Atualizando dados...')
        await Promise.allSettled([loadUsers(), loadFila(), loadCompras()])
        toast.success('Dados atualizados')
    } catch (err) {
        console.error('Erro no refreshAll', err)
        toast.error('Erro ao atualizar')
    }
    }

    async function toggleAdmin(u: any) {
    if (!u?.id) return
    loading.value.toggleAdmin = true
    togglingUserId.value = u.id
    try {
        const newIsAdmin = !Boolean(u.is_admin)
        const acessoValue: 'admin' | 'usuario' = newIsAdmin ? 'admin' : 'usuario'
        const payload = { acesso: acessoValue, is_admin: newIsAdmin ? 1 : 0 }
        console.debug('PUT /usuario/atualizarAcesso payload:', prettyJson(payload))
        await usuarioService.atualizarAcesso(u.id, payload)

        await loadUsers()

        try {
        const currentStr = localStorage.getItem('user') || localStorage.getItem('usuario')
        if (currentStr) {
            const cur = JSON.parse(currentStr)
            if (cur && cur.id === u.id) {
            localStorage.setItem('is_admin', newIsAdmin ? '1' : '0')
            }
        }
        } catch {}

        toast.success(newIsAdmin ? 'Usuário promovido a admin' : 'Admin removido')
    } catch (err) {
        console.error('Erro ao alternar admin', err)
        toast.error('Erro ao atualizar permissão')
    } finally {
        loading.value.toggleAdmin = false
        togglingUserId.value = null
    }
    }

    async function deleteUser() {
    if (!selectedUser.value?.id) return
    loading.value.deleteUser = true
    try {
        await api.delete(`/usuario/${selectedUser.value.id}`)
        toast.success('Usuário excluído (soft delete)')
        dialog.value.confirmDeleteUser = false
        await loadUsers()
    } catch (err) {
        console.error('Erro ao excluir usuário', err)
        toast.error('Erro ao excluir usuário')
    } finally {
        loading.value.deleteUser = false
        selectedUser.value = null
    }
    }

    function confirmRemoveFila(f: any) {
    selectedFila.value = f
    dialog.value.confirmRemoveFila = true
    }
    async function removeFila() {
    if (!selectedFila.value?.id) return
    loading.value.removeFila = true
    try {
        await filaService.remover(selectedFila.value.id)
        toast.success('Entrada removida da fila')
        dialog.value.confirmRemoveFila = false
        await loadFila()
    } catch (err) {
        console.error('Erro ao remover da fila', err)
        toast.error('Erro ao remover da fila')
    } finally {
        loading.value.removeFila = false
        selectedFila.value = null
    }
    }

    async function deleteCompra() {
    if (!selectedCompra.value?.id) return
    loading.value.deleteCompra = true
    try {
        await compraService.remover(selectedCompra.value.id)
        toast.success('Compra excluída (soft delete)')
        dialog.value.confirmDeleteCompra = false
        await loadCompras()
    } catch (err) {
        console.error('Erro ao excluir compra', err)
        toast.error('Erro ao excluir compra')
    } finally {
        loading.value.deleteCompra = false
        selectedCompra.value = null
    }
    }

    function formatTime(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    }

    function prettyJson(obj: any) {
    try {
        return JSON.stringify(obj, null, 2)
    } catch (_) {
        return String(obj)
    }
    }

    function formatLogShort(raw?: string) {
    if (!raw) return ''
    try {
        if (raw.includes('/')) {
        const parts = raw.split(' ')
        const datePart = parts[0] 
        if (!datePart) return raw
        const timePart = (parts[1] || '').split(':').slice(0,2).join(':') 
        const dayMonth = datePart.split('/').slice(0,2).join('/')
        return `${dayMonth}, ${timePart}`
        }
        const d = new Date(raw)
        if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2,'0')
        const month = String(d.getMonth()+1).padStart(2,'0')
        const hours = String(d.getHours()).padStart(2,'0')
        const mins = String(d.getMinutes()).padStart(2,'0')
        return `${day}/${month}, ${hours}:${mins}`
        }
    } catch (e) {}
    return raw
    }

    function applyUserFilter() {
    const q = (userFilter.value || '').toLowerCase().trim()
    if (!q) return loadUsers()
    users.value = users.value.filter(u => (u.nome || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
    }
    function clearUserFilter() { userFilter.value = ''; loadUsers() }

    async function fetchUserDetails(u: any) {
    if (!u?.id) return
    try {
        const res = await api.get(`/usuario/${u.id}`)
        userDetails.value = res?.data?.data ?? res?.data ?? res
        try {
        const r2 = await api.get(`/logs/usuario/${u.id}/ultimo-login`)
        const d2 = r2?.data?.data ?? r2?.data ?? {}
        userDetails.value.ultimo_login = d2?.ultimo_login ?? d2
        } catch {}
        userDetailsDialog.value = true
    } catch (err) {
        console.error('Erro ao buscar detalhes do usuário', err)
        toast.error('Erro ao buscar detalhes')
    }
    }

    async function restoreUser(u: any) {
    if (!u?.id) return
    restoringUserId.value = u.id
    loading.value.restoreUser = true
    try {
        await api.post(`/usuario/restore/${u.id}`)
        toast.success('Usuário restaurado')
        await loadUsers()
    } catch (err) {
        console.error('Erro ao restaurar usuário', err)
        toast.error('Erro ao restaurar usuário')
    } finally {
        loading.value.restoreUser = false
        restoringUserId.value = null
    }
    }

    function confirmDestroyUser(u: any) {
    selectedUser.value = u
    dialog.value.confirmDestroyUser = true
    }

    async function destroyUser() {
    if (!selectedUser.value?.id) return
    loading.value.destroyUser = true
    destroyingUserId.value = selectedUser.value.id
    try {
        await api.delete(`/usuario/destroy/${selectedUser.value.id}`)
        toast.success('Usuário excluído definitivamente')
        dialog.value.confirmDestroyUser = false
        await loadUsers()
    } catch (err) {
        console.error('Erro ao destruir usuário', err)
        toast.error('Erro ao excluir definitivamente')
    } finally {
        loading.value.destroyUser = false
        destroyingUserId.value = null
        selectedUser.value = null
    }
    }

    async function verPosicaoFila(f: any) {
    if (!f?.usuario_id) return
    try {
        const res = await api.get(`/fila/posicao/${f.usuario_id}`)
        const data = res?.data?.data ?? res?.data ?? {}
        toast.info(`Posição atual: ${data?.posicao ?? data}`)
    } catch (err) {
        console.error('Erro ao obter posição da fila', err)
        toast.error('Erro ao obter posição')
    }
    }

    function openEditCompra(c: any) {
    compraForm.value = { id: c.id, cafe_qnd: c.cafe_qnd ?? 0, filtro_qnd: c.filtro_qnd ?? 0 }
    compraEditDialog.value = true
    }

    async function loadLogs() {
    loading.value.loadLogs = true
    try {
        const params: any = {}
        if (logsFilter.value.usuarioId) params.usuarioId = logsFilter.value.usuarioId
        if (logsFilter.value.start) params.start = logsFilter.value.start
        if (logsFilter.value.end) params.end = logsFilter.value.end
        let res
        if (Object.keys(params).length > 0) res = await api.get('/logs/filtrar', { params })
        else res = await api.get('/logs')
        const raw = res?.data?.data ?? res?.data ?? []
        logs.value = (Array.isArray(raw) ? raw : []).map((l: any) => {
        const usuario = l.usuario ?? l.user ?? null
        return {
            id: l.id,
            usuario_id: l.usuario_id ?? l.user_id ?? (usuario ? usuario.id : null),
            tipo_evento: l.tipo_evento ?? l.tipo ?? l.action ?? null,
            data_evento: l.data_evento ?? l.created_at ?? l.data ?? l.timestamp ?? null,
            usuario: usuario ? { id: usuario.id, nome: usuario.nome ?? usuario.name, email: usuario.email } : null,
        }
        })
    } catch (err) {
        console.error('Erro ao carregar logs', err)
        toast.error('Erro ao carregar logs')
        logs.value = []
    } finally {
        loading.value.loadLogs = false
    }
    }

    function applyLogsFilter() { loadLogs() }
    function clearLogsFilter() { logsFilter.value = { usuarioId: null, start: null, end: null }; loadLogs() }

    async function exportReport() {
    loading.value.exportReport = true
    try {
        const params: any = {}
        if (logsFilter.value.usuarioId) params.usuarioId = logsFilter.value.usuarioId
        if (logsFilter.value.start) params.start = logsFilter.value.start
        if (logsFilter.value.end) params.end = logsFilter.value.end
        const res = await api.get('/logs/relatorio/periodo', { params, responseType: 'blob' })
        const blob = new Blob([res.data], { type: res.headers['content-type'] ?? 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        const filename = `relatorio_logs_${Date.now()}.csv`
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        toast.success('Relatório exportado')
    } catch (err) {
        console.error('Erro ao exportar relatório', err)
        toast.error('Erro ao exportar relatório')
    } finally {
        loading.value.exportReport = false
    }
    }

    async function loadUsersActive() {
    try {
        const res = await api.get('/logs/usuarios/ativos')
        const data = res?.data?.data ?? res?.data ?? res
        summary.value.ativos = Array.isArray(data) ? data.length : data ?? '-'
        toast.success('Usuários ativos carregados')
    } catch (err) {
        console.error('Erro ao carregar usuários ativos', err)
        toast.error('Erro ao carregar usuários ativos')
    }
    }

    async function saveEditCompra() {
    if (!compraForm.value?.id) return
    loading.value.saveCompra = true
    try {
        const payload = { cafe_qnd: compraForm.value.cafe_qnd, filtro_qnd: compraForm.value.filtro_qnd }
        console.debug(`PUT /compra/atualizar/${compraForm.value.id} payload:`, prettyJson(payload))
        await api.put(`/compra/atualizar/${compraForm.value.id}`, payload)
        toast.success('Compra atualizada')
        compraEditDialog.value = false
        await loadCompras()
    } catch (err) {
        console.error('Erro ao atualizar compra', err)
        toast.error('Erro ao atualizar compra')
    } finally {
        loading.value.saveCompra = false
    }
    }

    async function restoreCompra(c: any) {
    if (!c?.id) return
    try {
        await api.post(`/compra/restore/${c.id}`)
        toast.success('Compra restaurada')
        await loadCompras()
    } catch (err) {
        console.error('Erro ao restaurar compra', err)
        toast.error('Erro ao restaurar compra')
    }
    }

    function confirmDestroyCompra(c: any) {
    selectedCompra.value = c
    dialog.value.confirmDestroyCompra = true
    }

    async function destroyCompra() {
    if (!selectedCompra.value?.id) return
    loading.value.destroyCompra = true
    try {
        await api.delete(`/compra/destroy/${selectedCompra.value.id}`)
        toast.success('Compra excluída definitivamente')
        dialog.value.confirmDestroyCompra = false
        await loadCompras()
    } catch (err) {
        console.error('Erro ao destruir compra', err)
        toast.error('Erro ao excluir compra definitivamente')
    } finally {
        loading.value.destroyCompra = false
        selectedCompra.value = null
    }
}
</script>

<style scoped>
    .text-secondary { color: var(--text-secondary); }
    .header-logo { height: 64px; cursor: pointer; }

    .logo-img, .header-logo { height: 64px; max-height: 64px; width: auto; object-fit: contain; }
    .dashboard-header .v-container { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .dashboard-header .d-flex { flex-wrap: wrap; }

  .table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table-responsive::-webkit-scrollbar { height: 8px; }
  .table-responsive table { width: 100%; border-collapse: collapse; min-width: 360px; }

  .break-word, .v-simple-table td, .v-simple-table th { word-break: break-word; overflow-wrap: anywhere; }

  @media (max-width: 960px) {
    .logo-img, .header-logo { height: 56px; max-height: 56px; }
    .dashboard-main .v-container { padding-left: 16px; padding-right: 16px; }
    .table-responsive table { min-width: 320px; }
  }

  @media (max-width: 600px) {
    .logo-img, .header-logo { height: 48px; max-height: 48px; }
    .dashboard-header .v-container { flex-direction: column; align-items: flex-start; gap: 6px; }
    h2.text-h6 { font-size: 1rem; margin: 0; }
    .dashboard-app .v-app-bar { height: auto !important; padding-top: 8px; padding-bottom: 8px; }
    .v-card.pa-4 { padding: 12px !important; }
    .table-responsive table { min-width: 280px; font-size: 0.95rem; }

    .v-simple-table th, .v-simple-table td { white-space: normal; }

    .users-table table th:nth-child(3), .users-table table td:nth-child(3),
    .users-table table th:nth-child(4), .users-table table td:nth-child(4) {
      display: none;
    }

    .compras-table table th:nth-child(3), .compras-table table td:nth-child(3) {
      display: none;
    }

    .v-list-item { flex-wrap: wrap; }
    .v-list-item-content { min-width: 0; }
  }

  .logs-responsive { width: 100%; overflow-x: auto; }
  .logs-responsive .logs-item { border-bottom: 1px solid var(--border-color); padding: 10px 8px; }
  .logs-responsive .logs-row { gap: 8px; }
  .logs-responsive .logs-actions { display:flex; gap:8px; align-items:center }

  .reports-summary { display:block; }
  .reports-summary .text-h6 { font-weight:600 }

  .compras-table { width: 100%; }
  .compras-table table { min-width: 360px; }
  .compras-actions .v-btn { margin-left: 6px; }

  @media (max-width: 600px) {
    .compras-table table th:nth-child(3), .compras-table table td:nth-child(3) { display: none; }
    .compras-actions { display:flex; gap:6px; justify-content:flex-end }
  }

  @media (max-width: 580px) {
    .compras-actions { justify-content: center; }
    .compras-table .v-btn { padding: 6px; }
  }

  .panel-card { box-sizing: border-box; }
  @media (min-width: 315px) and (max-width: 400px) {
    .panel-card { width: 100% !important; max-width: 380px; margin-left: auto; margin-right: auto; }
  }

  @media (max-width: 600px) {
    .logs-responsive .logs-item { padding: 8px; }
    .logs-responsive .logs-row { flex-direction: column; align-items: center; text-align:center }
    .logs-responsive .logs-meta { text-align:center }

    .reports-summary v-row, .reports-summary .v-row { display:flex; flex-direction:column; gap:8px; align-items:center }
  }

  @media (max-width: 580px) {
    .table-responsive table thead { display: none; }
    .table-responsive table, .table-responsive tbody, .table-responsive tr, .table-responsive td {
      display: block; width: 100%;
    }
    .table-responsive tr { margin-bottom: 12px; border: 1px solid var(--border-color); border-radius: 8px; padding: 8px; }
    .table-responsive td { display: flex; justify-content: space-between; align-items: center; padding: 8px; }
    .table-responsive td::before { content: attr(data-label); font-weight: 600; margin-right: 8px; color: var(--text-secondary); }
    .table-responsive td[data-label="Ações"] { display: flex; gap: 8px; justify-content: flex-end; }
    .table-responsive table { min-width: unset; }
  }

  @media (max-width: 400px) {
    .table-responsive tr { padding: 6px; margin-bottom: 10px; }
    .table-responsive td { display: block; padding: 6px 8px; box-sizing: border-box; }
    .table-responsive td::before { display: block; margin-bottom: 4px; }

    .table-responsive td[data-label="Ações"] { display: block; }
    .table-responsive td[data-label="Ações"] .v-btn { display: inline-block; margin-right: 6px; margin-bottom: 6px; white-space: normal; }

    .v-chip { max-width: 100%; white-space: normal; overflow-wrap: anywhere; }
    .v-icon { flex: 0 0 auto; }

    .dashboard-header .d-flex { flex-wrap: wrap; gap: 6px; }
    .dashboard-header img { max-width: 40%; height: auto; }

    .v-card.pa-4 { padding: 10px !important; }
    .dashboard-main .v-container { padding-left: 8px; padding-right: 8px; }

    .dashboard-app, .dashboard-main, .v-main, .v-application { box-sizing: border-box; }
  }

  @media (min-width: 315px) and (max-width: 380px) {
    .dashboard-header .v-container { padding-left: 6px; padding-right: 6px; gap: 6px; }
    .dashboard-header .d-flex { gap: 6px; flex-wrap: wrap; align-items: center; }
    .logo-img, .header-logo { height: 48px; max-height: 48px; }
    .dashboard-header h2.text-h6 { font-size: 1rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
    .dashboard-header p.text-caption { display: none; }
    .dashboard-header .d-flex > div:last-child { flex: 1; min-width: 0; }
    .dashboard-header .v-btn { padding: 4px; min-width: 36px; }
    .v-app-bar.dashboard-header { overflow-x: hidden; }
    .dashboard-main .v-container { padding-left: 6px; padding-right: 6px; }
  }

  @media (min-width: 315px) and (max-width: 400px) {
    .dashboard-main .v-container { display: flex; flex-direction: column; align-items: center; gap: 12px; padding-left: 6px; padding-right: 6px; }

    .v-card { width: 100% !important; max-width: 380px; margin-left: auto; margin-right: auto; }

    .dashboard-header .v-container { justify-content: center; align-items: center; flex-direction: column; text-align: center; }
    .dashboard-header .d-flex { justify-content: center; align-items: center; }
    .logo-img, .header-logo { margin: 0 auto; }

    .table-responsive table thead { display: none; }
    .table-responsive table, .table-responsive tbody, .table-responsive tr, .table-responsive td { display: block; width: 100%; }
    .table-responsive tr { max-width: 360px; margin-left: auto; margin-right: auto; }
    .table-responsive td { display: block; text-align: center; padding: 8px 6px; box-sizing: border-box; }
    .table-responsive td::before { display: block; text-align: center; }

    .table-responsive td[data-label="Ações"] { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }

    .v-list-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .v-list-item-content { width: 100%; }

    .v-chip { font-size: 0.85rem; padding: 4px 6px; }
    .v-icon { font-size: 18px; }
  }
</style>