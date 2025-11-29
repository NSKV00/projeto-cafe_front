<template>
  <div class="login-bg d-flex align-center justify-center">
    <v-card
      elevation="6"
      class="pa-8 rounded-xl fade-in"
      width="420"
      style="background-color: var(--background-surface); color: var(--text-primary); backdrop-filter: blur(10px);"
    >
      <!-- Logo -->
      <div class="text-center mb-6 slide-down">
        <img src="" alt="Coffee Queue" width="120" />
      </div>

      <h2 class="text-h5 font-weight-bold mb-1 text-center" style="color: var(--color-primary);">
        Bem-vindo de volta
      </h2>

      <p class="mb-6 text-body-2 text-center" style="color: var(--text-secondary);">
        Acesse sua conta para continuar
      </p>

      <v-form @submit.prevent="handleLogin" class="space-y slide-up">

        <!-- Email -->
        <v-text-field
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="comfortable"
          color="var(--color-primary)"
          type="email"
          clearable
          required
        />

        <!-- Senha -->
        <v-text-field
          v-model="formData.password"
          label="Senha"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          density="comfortable"
          color="var(--color-primary)"
          type="password"
          clearable
          required
        />

        <!-- Entrar -->
        <v-btn
          block
          class="py-3 mt-2 pulse"
          :style="{
            backgroundColor: 'var(--button-primary-bg)',
            color: 'var(--button-primary-text)'
          }"
          type="submit"
        >
          Entrar
          <v-icon end>mdi-login</v-icon>
        </v-btn>

        <!-- Divider -->
        <div class="d-flex align-center my-4">
          <v-divider class="flex-grow-1"></v-divider>
          <span class="mx-3" style="color: var(--text-secondary);">ou</span>
          <v-divider class="flex-grow-1"></v-divider>
        </div>

        <!-- Ir para Cadastro -->
        <v-btn
          block
          class="py-3"
          variant="outlined"
          :style="{
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)'
          }"
          @click="goToRegister"
        >
          <v-icon start>mdi-account-plus</v-icon>
          Criar Conta
        </v-btn>

      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  email: '',
  password: ''
});

const handleLogin = () => {
  console.log('Login data:', formData.value);
};

const goToRegister = () => {
  console.log('Go to Register');
  // Altere o componente da página principal aqui
};
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background-image: url(../assets/GrãosdeCaféemDetalhe.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 24px;
  overflow: hidden;
}

.space-y > * + * {
  margin-top: 18px;
}

/* ANIMAÇÕES */
.fade-in {
  animation: fadeIn 0.8s ease forwards;
}

.slide-down {
  animation: slideDown 0.7s ease forwards;
}

.slide-up {
  animation: slideUp 0.7s ease forwards;
}

.pulse:hover {
  animation: pulse 0.6s infinite alternate ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.04); }
}
</style>
