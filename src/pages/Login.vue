<template>
  <div class="login-page">
    <v-card
      elevation="6"
      class="pa-4 rounded-xl login-card animate-fade-in"
      width="420"
    >
      <div class="d-flex justify-center mb-2 animate-slide-down">
        <img :src="logo" class="logo-img" alt="Logo CoffeeQueue" />
      </div>

      <h2 class="text-h6 font-weight-bold mb-1 animate-fade-in-delayed title">
        Bem-vindo de volta
      </h2>

      <p class="mb-3 text-body-2 animate-fade-in-delayed subtitle">
        Acesse sua conta para continuar
      </p>

      <v-form @submit.prevent="handleLogin" class="form-compact animate-fade-in-delayed">
        <v-text-field
          class="text-field"
          v-model="email"
          label="Email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="compact"
          type="email"
          clearable
          required
        />

        <v-text-field
          class="text-field"
          v-model="senha"
          label="Senha"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showSenha ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="toggleShowSenha"
          variant="outlined"
          density="compact"
          :type="showSenha ? 'text' : 'password'"
          clearable
          required
        />

        <v-btn
          block
          class="py-2 mt-1 btn-primary animate-button-pulse"
          type="submit"
          :loading="carregando"
        >
          Entrar
          <v-icon end>mdi-login</v-icon>
        </v-btn>

        <div class="d-flex align-center my-3">
          <v-divider class="flex-grow-1"></v-divider>
          <span class="mx-3 subtitle">ou</span>
          <v-divider class="flex-grow-1"></v-divider>
        </div>

        <v-btn
          block
          class="py-2 btn-outline animate-fade-in-delayed"
          variant="outlined"
          @click="goToRegister"
        >
          <v-icon start>mdi-account-plus</v-icon>
          Criar Conta
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { toast } from 'vue3-toastify'
  import authService from '../services/authService'
  import logo from '../assets/LogoCoffeeQueue.png'

  const router = useRouter()

  const email = ref('')
  const senha = ref('')
  const carregando = ref(false)
  const showSenha = ref(false)

  function toggleShowSenha() {
    showSenha.value = !showSenha.value
  }

  async function handleLogin() {
    if (!email.value || !senha.value) {
      toast.error('Preencha todos os campos')
      return
    }

    carregando.value = true

      try {
      const response = await authService.login(email.value, senha.value)

      if (response.data?.success && response.data?.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token)
        const respData: any = response.data.data ?? response.data
        const usuario = respData?.usuario ?? respData?.user ?? null
        try {
          if (usuario && usuario.acesso) {
            localStorage.setItem('is_admin', usuario.acesso === 'admin' ? '1' : '0')
          }
        } catch {}
        toast.success('Login realizado com sucesso!')
        setTimeout(() => router.push('/'), 1000)
      } else {
        toast.error(response.data?.message || 'Erro ao fazer login')
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Erro ao fazer login'
      toast.error(errorMsg)
      console.error('Login error:', error)
    } finally {
      carregando.value = false
    }
  }

  function goToRegister(): void {
    router.push('/cadastro')
  }
</script>

<style scoped>
  .login-page {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-image: url(../assets/GrãosdeCaféemDetalhe.png);
    background-size: cover;
    background-position: center;
  }

  .login-card {
    background: rgba(0, 0, 0, 0.123);
    backdrop-filter: blur(6px);
    color: var(--text-primary);
  }

  .logo-img {
    width: 100px;
    opacity: 0.95;
  }

  .form-compact > * + * {
    margin-top: 8px !important;
  }

  .title {
    color: var(--color-gray-soft);
  }

  .subtitle {
    color: var(--color-gray-soft);
  }

  .flex-grow-1 {
    border-color: var(--color-gray-soft) !important;
  }

  .text-field {
    color: var(--color-gray-soft) !important;
  }

  .btn-primary {
    background-color: var(--button-primary-bg);
    color: var(--button-primary-text);
  }

  .btn-outline {
    border-color: var(--color-gray-medium) !important;
    color: var(--color-gray-medium) !important;
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease forwards;
  }

  .animate-fade-in-delayed {
    opacity: 0;
    animation: fadeIn 0.8s ease forwards;
    animation-delay: 0.2s;
  }

  .animate-slide-down {
    transform: translateY(-10px);
    opacity: 0;
    animation: slideDown 0.6s ease forwards;
  }

  .animate-button-pulse {
    animation: pulse 0.6s ease;
  }

  @media (max-width: 450px) {
    .login-card {
      width: 92% !important;
      padding: 18px !important;
    }

    .form-compact > * + * {
      margin-top: 8px !important;
    }

    .logo-img {
      width: 80px !important;
    }

    .v-input {
      font-size: 0.88rem !important;
    }

    .v-field__input {
      padding: 6px 10px !important;
    }
  }

  @media (max-width: 360px) {
    .login-card {
      width: 94% !important;
      padding: 14px !important;
    }

    .logo-img {
      width: 70px !important;
    }

    .v-field__input {
      padding: 5px 8px !important;
    }

    .title {
      font-size: 1.05rem !important;
    }

    .subtitle {
      font-size: 0.82rem !important;
    }
  }

  @media (max-width: 319px) {
    .login-card {
      width: 96% !important;
      padding: 10px !important;
    }

    .logo-img {
      width: 60px !important;
    }

    .v-field__input {
      padding: 4px 7px !important;
    }

    .v-input {
      font-size: 0.78rem !important;
    }

    .btn-primary,
    .btn-outline {
      padding: 6px !important;
      font-size: 0.75rem !important;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.03);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
