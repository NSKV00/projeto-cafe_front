<template>
    <v-app class="dashboard-app">
        <v-app-bar class="dashboard-header" flat elevation="1" height="92">
            <v-container fluid class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                    <img 
                    :src="Logo" 
                    alt="CoffeeQueue" 
                    class="logo-img header-logo" 
                    @click="goHome" 
                    style="cursor:pointer" 
                    />
                </div>

                <div class="d-flex align-center gap-2">
                    <v-tooltip location="bottom">
                    <template #activator="{ props }">
                        <v-btn v-bind="props" icon size="small" @click="refreshAll">
                        <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </template>
                    <span>Atualizar</span>
                    </v-tooltip>

                    <v-tooltip location="bottom">
                    <template #activator="{ props }">
                        <v-btn 
                        v-bind="props" 
                        icon size="small" 
                        @click="toggleTheme"
                        >
                        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ isDark ? 'Modo Claro' : 'Modo Escuro' }}</span>
                    </v-tooltip>

                    <v-tooltip location="bottom">
                    <template #activator="{ props }">
                        <v-btn 
                        v-bind="props" 
                        icon 
                        size="small" 
                        @click="openProfileActions"
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
                        <h2 class="text-h5 mb-2" :style="{ color: 'var(--text-primary)' }">Perfil</h2>
                    </div>
                    </v-col>
                </v-row>

                <v-row dense>
                <v-col cols="12" md="4">
                    <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
                    <div class="d-flex align-center mb-3">
                        <v-avatar size="48" color="var(--color-secondary)"><v-icon>mdi-account</v-icon></v-avatar>
                        <div class="ml-3">
                        <p class="text-body-1"><strong>{{ user.nome || '—' }}</strong></p>
                        <p class="text-caption text-secondary">{{ user.email || '—' }}</p>
                        </div>
                    </div>

                    <v-divider class="mb-3" />

                    <div class="d-flex flex-column gap-2">
                        <div class="d-flex justify-space-between">
                        <span class="text-caption">Posição na fila</span>
                        <span class="text-body-2 font-weight-bold">{{ positionDisplay }}</span>
                        </div>

                        <div class="d-flex justify-space-between">
                        <span class="text-caption">É sua vez?</span>
                        <span :class="isMyTurn ? 'text-success' : 'text-secondary'">{{ isMyTurn ? 'Sim' : 'Não' }}</span>
                        </div>
                    </div>

                    <v-divider class="my-3" />
                    <div>
                        <v-tooltip location="top">
                            <template #activator="{ props }">
                            <v-btn v-bind="props" v-longpress block :color="inQueue ? 'error' : 'primary'" @click="inQueue ? leaveQueue() : joinQueue()" :loading="joiningQueue || leavingQueue">
                                {{ inQueue ? 'Sair da fila' : 'Entrar na fila' }}
                            </v-btn>
                            </template>
                            <span>{{ inQueue ? 'Clique para sair da fila' : 'Clique para entrar na fila' }}</span>
                        </v-tooltip>
                    </div>

                    <v-divider class="my-3" />

                    <v-tooltip location="top">
                        <template #activator="{ props }">
                        <v-btn v-bind="props" v-longpress :title="editing ? 'Cancelar edição' : 'Editar dados'" block color="secondary" @click="editing = !editing">
                            {{ editing ? 'Cancelar edição' : 'Editar dados' }}
                        </v-btn>
                        </template>
                        <span>{{ editing ? 'Cancelar alterações' : 'Editar seus dados' }}</span>
                    </v-tooltip>
                    </v-card>
                </v-col>

                <v-col cols="12" md="5">
                    <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
                    <div class="d-flex align-center mb-3">
                        <v-icon size="20">mdi-shopping</v-icon>
                        <span class="ml-3 text-subtitle-2">Minhas Compras</span>
                    </div>

                    <v-list dense class="recent-list">
                        <v-list-item v-for="p in myPurchases" :key="p.id">
                        <v-list-item-avatar color="var(--color-secondary)"><v-icon small>mdi-check-circle</v-icon></v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ formatPurchaseTitle(p) }}</v-list-item-title>
                            <v-list-item-subtitle class="text-caption text-secondary">{{ formatTime(p.created_at) }}</v-list-item-subtitle>
                        </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="myPurchases.length === 0">
                        <v-list-item-title class="text-caption text-secondary text-center w-100">Nenhuma compra registrada</v-list-item-title>
                        </v-list-item>
                    </v-list>

                    <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-color)">
                        <v-form @submit.prevent="registerPurchase">
                        <v-row dense>
                            <v-col cols="6">
                            <v-text-field v-model.number="newPurchase.cafe_qnd" type="number" min="0" label="Café (qtd)" dense />
                            </v-col>
                            <v-col cols="6">
                            <v-text-field v-model.number="newPurchase.filtro_qnd" type="number" min="0" label="Filtro (qtd)" dense />
                            </v-col>
                            <v-col cols="12">
                            <v-btn block color="primary" type="submit" :loading="loadingPurchase">Registrar Compra</v-btn>
                            </v-col>
                        </v-row>
                        </v-form>
                    </div>
                    </v-card>
                </v-col>

                <v-col cols="12" md="3">
                    <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
                    <div class="d-flex align-center mb-3">
                        <v-icon size="20">mdi-account-edit</v-icon>
                        <span class="ml-3 text-subtitle-2">Editar Usuário</span>
                    </div>

                    <div v-if="editing">
                        <v-form @submit.prevent="saveEdit">
                        <v-text-field v-model="form.nome" label="Nome" required dense />
                        <v-text-field v-model="form.email" label="Email" required dense />
                        <v-text-field v-model="form.senha" label="Nova senha (opcional)" :type="showSenha ? 'text' : 'password'" dense append-inner-icon="mdi-eye" @click:append-inner="toggleShowSenha" />
                        <v-row class="mt-3">
                            <v-col cols="6">
                            <v-btn block color="primary" type="submit" :loading="saving">Salvar</v-btn>
                            </v-col>
                            <v-col cols="6">
                            <v-btn block outlined @click="resetForm">Reset</v-btn>
                            </v-col>
                        </v-row>
                        </v-form>
                    </div>

                    <div v-else class="text-caption text-secondary">
                        Use "Editar dados" para alterar nome, email ou senha.
                    </div>
                    </v-card>
                </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>

    <v-dialog v-model="showDeleteConfirm" width="480">
      <v-card>
        <v-card-title>Confirmar exclusão</v-card-title>
        <v-card-text>Tem certeza que deseja excluir sua conta?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteConfirm = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteAccount" :loading="deleting">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showProfileActions" width="360">
      <v-card>
        <v-card-title class="text-h6">Conta</v-card-title>
        <v-card-text>
          <div class="mb-2">{{ user.nome || user.email || 'Usuário' }}</div>
          <div class="text-caption text-secondary">Escolha uma ação</div>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showProfileActions = false">Fechar</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="openDeleteFromProfile">Excluir conta</v-btn>
          <v-btn color="primary" @click="openLogoutFromProfile">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showLogoutConfirm" width="480">
      <v-card>
        <v-card-title>Confirmar logout</v-card-title>
        <v-card-text>Deseja realmente sair da sua conta?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showLogoutConfirm = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmLogout">Sair</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

    const user = ref<any>({})
    const myPurchases = ref<any[]>([])
    const position = ref<number | null>(null)
    const isMyTurn = ref<boolean>(false)

    const isDark = ref<boolean>(theme.global.current.value.dark ?? false)

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

    function goHome() {
    router.push('/')
    }

    const joiningQueue = ref(false)
    const leavingQueue = ref(false)
    const inQueue = computed(() => typeof position.value === 'number' && position.value > 0)

    async function joinQueue() {
    if (!user.value?.id) return toast.error('Usuário não identificado')
    joiningQueue.value = true
    try {
        await filaService.criar(user.value.id)
        toast.success('Você entrou na fila')
        await refreshDependent()
    } catch (err) {
        console.error('Erro ao entrar na fila', err)
        toast.error('Erro ao entrar na fila')
    } finally {
        joiningQueue.value = false
    }
    }

    async function leaveQueue() {
    if (!user.value?.id) return toast.error('Usuário não identificado')
    leavingQueue.value = true
    try {
        const listRes = await filaService.listar()
        const data = listRes?.data?.data ?? listRes?.data ?? []
        const entry = Array.isArray(data) ? data.find((f: any) => (f.usuario_id ?? f.usuario?.id) === user.value.id) : null
        if (!entry || !entry.id) {
        toast.info('Entrada na fila não encontrada')
        await refreshDependent()
        return
        }
        await filaService.remover(entry.id)
        toast.success('Você saiu da fila')
        await refreshDependent()
    } catch (err) {
        console.error('Erro ao sair da fila', err)
        toast.error('Erro ao sair da fila')
    } finally {
        leavingQueue.value = false
    }
    }

    const editing = ref(false)
    const form = ref<{ nome?: string; email?: string; senha?: string }>({})
    const showDeleteConfirm = ref(false)
    const deleting = ref(false)
    const showProfileActions = ref(false)
    const showLogoutConfirm = ref(false)
    function openProfileActions() { showProfileActions.value = true }
    async function confirmLogout() {
    showLogoutConfirm.value = false
    await new Promise((r) => setTimeout(r, 120))
    logout()
    }
    function openDeleteFromProfile() {
    showProfileActions.value = false
    showDeleteConfirm.value = true
    }

    function openLogoutFromProfile() {
    showProfileActions.value = false
    showLogoutConfirm.value = true
    }
    const saving = ref(false)
    const loadingPurchase = ref(false)
    const newPurchase = ref({ cafe_qnd: 0, filtro_qnd: 0 })
    const showSenha = ref(false)

    const cardStyle = `
    background: var(--background-surface);
    border: 1px solid var(--border-color);
    `

    function toggleShowSenha() { showSenha.value = !showSenha.value }

    function formatTime(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    function formatPurchaseTitle(p: any) {
    const c = p.cafe_qnd ?? 0
    const f = p.filtro_qnd ?? 0
    return `Café: ${c} • Filtro: ${f} • ID: ${p.id ?? '—'}`
    }

    const positionDisplay = computed(() => {
    if (position.value === null) return '—'
    if (position.value === 0) return 'Já atendido'
    return position.value.toString()
    })

    async function refreshAll() {
    try {
        toast.info('Atualizando dados...')
        await loadProfile()
        await refreshDependent()
        toast.success('Dados atualizados')
    } catch (err) {
        console.error('Erro no refreshAll', err)
        toast.error('Erro ao atualizar')
    }
    }

    async function loadProfile() {
    try {
        const res = await api.get('/login/verificarToken')
        const payload = res?.data?.data ?? res?.data ?? {}
        user.value = payload.usuario ?? payload.user ?? payload ?? {}
        if (!user.value?.id && payload?.id) user.value = payload

        // update local is_admin flag from backend 'acesso' if present
        try {
          const acesso = user.value?.acesso ?? payload?.usuario?.acesso ?? payload?.acesso
          if (typeof acesso !== 'undefined') {
            localStorage.setItem('is_admin', String(acesso) === 'admin' ? '1' : '0')
          }
        } catch {}

        await refreshDependent()
    } catch (err) {
        console.error('Erro ao carregar perfil', err)
        try {
        const r2 = await usuarioService.listar()
        const data = r2?.data?.data ?? r2?.data ?? []
        if (Array.isArray(data) && data.length > 0) user.value = data[0]
        } catch { }
    }
    }

    async function refreshDependent() {
    try {
        if (user.value?.id) {
            try {
            const posRes = await filaService.posicaoUsuario(user.value.id)
            const posData = posRes?.data?.data ?? posRes?.data ?? null
            position.value = posData?.posicao ?? null
            } catch (err: any) {
            position.value = null
            }

            try {
            const nextRes = await filaService.proximo()
            const nextData = nextRes?.data?.data ?? nextRes?.data ?? null
            let nextUserId: any = null
            if (nextData) {
                nextUserId = nextData?.usuario_id ?? null
                if (!nextUserId) nextUserId = nextData?.usuario?.id ?? null
                if (!nextUserId) nextUserId = nextData?.Usuario?.id ?? null
                if (!nextUserId && nextData?.Usuario && typeof nextData.Usuario === 'object') {
                nextUserId = nextData.Usuario.id ?? nextData.Usuario.usuario_id ?? null
                }
                if (!nextUserId && nextData?.usuario && typeof nextData.usuario === 'object') {
                nextUserId = nextData.usuario.id ?? nextData.usuario.usuario_id ?? null
                }
                if (!nextUserId && typeof nextData === 'object') {
                for (const k of Object.keys(nextData)) {
                    const v = (nextData as any)[k]
                    if (v && typeof v === 'object' && (v.id || v.usuario_id)) {
                    nextUserId = v.id ?? v.usuario_id
                    break
                    }
                }
                }
            }

            const byNext = !!(nextUserId != null && String(nextUserId) === String(user.value?.id))
            const byPosition = position.value === 1
            isMyTurn.value = byNext || byPosition
            } catch (err: any) {
            isMyTurn.value = false
            }
        }

        const comprasRes = await compraService.listar()
        const all = comprasRes?.data?.data ?? comprasRes?.data ?? []
        myPurchases.value = Array.isArray(all) ? all.filter((c: any) => (c.usuario_id ?? c.usuario?.id) === user.value.id) : []
    } catch (err) {
        console.error('Erro ao carregar dados dependentes', err)
    }
    }

    function resetForm() {
    form.value = { nome: user.value.nome, email: user.value.email, senha: '' }
    }

    async function saveEdit() {
    if (!user.value?.id) return toast.error('Usuário não carregado')
    saving.value = true
    try {
        const payload: any = {}
        if (form.value.nome) payload.nome = form.value.nome
        if (form.value.email) payload.email = form.value.email
        if (form.value.senha) payload.senha = form.value.senha
        const res = await usuarioService.atualizar(user.value.id, payload)
        const data = res?.data?.data ?? res?.data ?? {}
        user.value = data ?? user.value
        editing.value = false
        toast.success('Dados atualizados')
    } catch (err: any) {
        console.error('Erro ao salvar usuário', err)
        toast.error(err?.response?.data?.message || 'Erro ao salvar')
    } finally {
        saving.value = false
    }
    }

    async function deleteAccount() {
    if (!user.value?.id) return
    deleting.value = true
    try {
        await api.delete(`/usuario/${user.value.id}`)
        toast.success('Conta excluída (soft delete)')
        logout()
    } catch (err) {
        console.error('Erro ao excluir conta', err)
        toast.error('Erro ao excluir conta')
    } finally {
        deleting.value = false
        showDeleteConfirm.value = false
    }
    }

    function logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('is_admin')
    toast.success('Desconectado')
    setTimeout(() => router.push('/login'), 400)
    }

    async function registerPurchase() {
    if (!user.value?.id) return toast.error('Usuário não identificado')
    loadingPurchase.value = true
    try {
        const payload = {
        usuario_id: user.value.id,
        cafe_qnd: newPurchase.value.cafe_qnd || 0,
        filtro_qnd: newPurchase.value.filtro_qnd || 0,
        }
        await compraService.criar(payload)
        toast.success('Compra registrada')
        newPurchase.value = { cafe_qnd: 0, filtro_qnd: 0 }
        await refreshDependent()
    } catch (err) {
        console.error('Erro ao registrar compra', err)
        toast.error('Erro ao registrar compra')
    } finally {
        loadingPurchase.value = false
    }
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

        await loadProfile()
    form.value = { nome: user.value.nome, email: user.value.email, senha: '' }
    })
</script>

<style scoped>
    .text-secondary { 
        color: var(--text-secondary); 
    }
    .header-logo { 
        height: 64px; cursor: pointer; 
    }

    .logo-img, 
    .header-logo { 
        height: 64px; 
        max-height: 64px; 
        width: auto; 
        object-fit: contain; 
    }

    .dashboard-header 
    .v-container { 
        display: flex; 
        flex-wrap: wrap; 
        align-items: center; 
        gap: 8px; 
        top: 4px;
    }

    .dashboard-header 
    .d-flex { 
        flex-wrap: wrap; 
    }

    @media (max-width: 960px) {
        .logo-img, 
        .header-logo { 
            height: 56px;
            max-height: 56px; 
        }
    }

    @media (max-width: 600px) {
        .logo-img, .header-logo { height: 48px; max-height: 48px; }
        .dashboard-header .v-container { 
            flex-direction: column; 
            align-items: flex-start; 
            gap: 6px; 
        }
        h2.text-h6 { 
            font-size: 1rem; 
            margin: 0; 
        }
        .dashboard-app .v-app-bar { 
            height: auto !important; 
            padding-top: 8px; 
            padding-bottom: 8px; 
        }
    }

    @media (max-width: 400px) {
        .dashboard-header .d-flex { 
            flex-wrap: wrap; 
            gap: 6px; 
        }
        .dashboard-header img { 
            max-width: 40%; 
            height: auto; 
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