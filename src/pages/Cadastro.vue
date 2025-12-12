<template>
  <div class="register-page">
    <v-card
      elevation="6"
      class="pa-4 rounded-xl register-card animate-fade-in"
      width="420"
    >
      <div class="d-flex justify-center mb-2 animate-slide-down">
        <img :src="logo" class="logo-img" alt="Logo CoffeeQueue" />
      </div>

      <h2 class="text-h6 font-weight-bold mb-1 animate-fade-in-delayed title">
        Criar Conta
      </h2>

      <p class="mb-3 text-body-2 animate-fade-in-delayed subtitle">
        Cadastre-se para acessar o sistema da fila do café
      </p>

      <v-form @submit.prevent="handleSubmit" class="form-compact animate-fade-in-delayed">
        <v-text-field
          class="text-field"
          v-model="nome"
          label="Nome completo"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          density="compact"
          clearable
          required
        />

        <v-text-field
          class="text-field"
          v-model="email"
          @input="validarEmail"
          label="Email"
          :error-messages="erroEmail"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="compact"
          clearable
          required
        />

        <v-text-field
          class="text-field"
          v-model="senha"
          @input="validarSenha"
          label="Senha"
          :error-messages="erroSenha"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showSenha ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="toggleShowSenha"
          variant="outlined"
          density="compact"
          :type="showSenha ? 'text' : 'password'"
          clearable
          required
        />

        <v-checkbox
          v-model="aceitaTermos"
          class="checkbox-compact"
          required
        >
          <template #label>
            <span>
              Eu aceito os
              <span class="terms" @click.prevent="mostrarTermos = true">
                Termos e Condições
              </span>
            </span>
          </template>
        </v-checkbox>

        <v-btn
          block
          class="py-2 mt-1 animate-button-pulse btn-primary"
          type="submit"
          :loading="carregando"
        >
          Criar conta
          <v-icon end>mdi-arrow-right</v-icon>
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
          @click="irParaLogin"
        >
          <v-icon start>mdi-login</v-icon>
          Já tenho conta
        </v-btn>
      </v-form>
    </v-card>

    <v-dialog v-model="mostrarTermos" width="600">
      <v-card class="pa-4">
        <h3 class="text-h6 mb-2">Termos e Condições</h3>
        <v-divider class="mb-3"></v-divider>
        <p class="text-body-2 pre-line">{{ textoTermos }}</p>

        <v-btn class="mt-3" color="primary" block @click="mostrarTermos = false">
          Fechar
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { toast } from 'vue3-toastify'
  import usuarioService from '../services/usuarioService'
  import logo from '../assets/LogoCoffeeQueue.png'

  const router = useRouter()

  const nome = ref('')
  const email = ref('')
  const senha = ref('')
  const carregando = ref(false)
  const showSenha = ref(false)
  const aceitaTermos = ref(false)
  const mostrarTermos = ref(false)

  const erroEmail = ref('')
  const erroSenha = ref('')

  const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/
  const dominiosComuns = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com']

  function toggleShowSenha(): void {
    showSenha.value = !showSenha.value
  }

  function distanciaLevenshtein(a: string, b: string): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))

    for (let i = 0; i <= a.length; i++) dp[i]![0] = i
    for (let j = 0; j <= b.length; j++) dp[0]![j] = j

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const custo = a[i - 1] === b[j - 1] ? 0 : 1
        dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + custo)
      }
    }

    return dp[a.length]![b.length]!
  }

  function validarEmail() {
    erroEmail.value = ''

    if (!email.value) return

    if (!emailRegex.test(email.value)) {
      erroEmail.value = 'Formato de e-mail inválido'
      return
    }

    const [, dominio] = email.value.split('@')
    const sugestao = dominiosComuns.find((d) => distanciaLevenshtein(dominio || '', d) <= 2)

    if (sugestao && dominio !== sugestao) {
      erroEmail.value = `Você quis dizer ${email.value.split('@')[0]}@${sugestao}?`
    }
  }

  function validarSenha() {
    erroSenha.value = ''

    if (!senha.value) return

    if (senha.value.length < 8) {
      erroSenha.value = 'Senha deve ter no mínimo 8 caracteres'
      return
    }

    if (senha.value.match(/[A-Z]/) === null) {
      erroSenha.value = 'Senha deve conter uma letra maiúscula'
      return
    }

    if (senha.value.match(/[a-z]/) === null) {
      erroSenha.value = 'Senha deve conter uma letra minúscula'
      return
    }

    if (senha.value.match(/[0-9]/) === null) {
      erroSenha.value = 'Senha deve conter um número'
      return
    }

    if (senha.value.match(/[!@#$%^&*(),.?":{}|<>]/) === null) {
      erroSenha.value = 'Senha deve conter um caracter especial'
      return
    }
  }

  function validarFormulario(): boolean {
    if (!nome.value || !email.value || !senha.value) {
      toast.error('Preencha todos os campos')
      return false
    }

    if (!emailRegex.test(email.value)) {
      toast.error('Email inválido')
      return false
    }

    if (erroEmail.value.includes('?')) {
      toast.error(erroEmail.value)
      return false
    }

    if (senha.value.length < 8) {
      toast.error('A senha deve ter ao menos 8 caracteres')
      return false
    }

    if (erroSenha.value.includes('Senha')) {
      toast.error(erroSenha.value)
      return false
    }

    if (!aceitaTermos.value) {
      toast.error('Você deve aceitar os Termos e Condições')
      return false
    }

    return true
  }

  async function handleSubmit(): Promise<void> {
    if (!validarFormulario()) return

    carregando.value = true

    try {
      const res = await usuarioService.criar({
        nome: nome.value,
        email: email.value,
        senha: senha.value,
      })

      if (res.status === 201 || res.data?.success) {
        toast.success('Conta criada com sucesso!')
        setTimeout(() => router.push('/login'), 1000)
      } else {
        toast.error(res.data?.message || 'Erro ao cadastrar')
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Erro ao cadastrar'
      toast.error(errorMsg)
      console.error('Cadastro error:', err)
    } finally {
      carregando.value = false
    }
  }

  function irParaLogin(): void {
    router.push('/login')
  }

  const textoTermos = `📄 **Termos e Condições**

  1. Você deve fornecer dados verdadeiros.
  2. Compradores e vendedores são responsáveis pelos itens.
  3. Pagamentos devem ser feitos por canais autorizados.
  4. Produtos usados devem conter informações reais.
  5. Tentativas de fraude resultam em banimento.
  6. Dados seguem a LGPD.`
</script>

<style scoped>
  .register-page {
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

  .register-card {
    position: relative;
    width: 95%;
    max-width: 420px;
    background: rgba(0, 0, 0, 0.123);
    backdrop-filter: blur(6px);
    color: var(--text-primary);
  }

  .logo-img {
    width: 100px;
    opacity: 0.95;
  }

  .form-compact > * + * {
    margin-top: 10px !important;
  }

  .checkbox-compact {
    margin-top: -2px !important;
    margin-bottom: -4px !important;
    color: var(--color-gray-medium);
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

  .terms {
    color: var(--highlight-color);
    cursor: pointer;
    font-weight: 600;
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
    .register-card {
      justify-content: center;
      width: 90% !important;
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

    .checkbox-compact {
      margin-top: -4px !important;
      margin-bottom: -6px !important;
    }
  }

  @media (max-width: 360px) {
    .register-card {
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
    .register-card {
      width: 96% !important;
      padding: 10px !important;
    }

    .logo-img {
      width: 60px !important;
    }

    .v-field__input {
      padding: 4px 7px !important;
    }

    .v-input,
    .v-checkbox {
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
