<template>
  <div class="register-page">
    <div class="overlay"></div>

    <v-card
      elevation="6"
      class="pa-8 rounded-xl register-card animate-fade-in"
      width="450"
    >
      <!-- LOGO NO TOPO DO CARD -->
      <div class="d-flex justify-center mb-4 animate-slide-down">
        <img src="./assets/logo-coffee-queue.png" alt="Coffee Queue Logo" class="logo-img" />
      </div>

      <h2 class="text-h5 font-weight-bold mb-1 animate-fade-in-delayed" style="color: var(--color-primary);">
        Criar Conta
      </h2>

      <p class="mb-6 text-body-2 animate-fade-in-delayed" style="color: var(--text-secondary);">
        Cadastre-se para acessar o sistema da fila do café
      </p>

      <v-form @submit.prevent="handleSubmit" class="space-y animate-fade-in-delayed">

        <!-- Nome -->
        <v-text-field
          v-model="formData.fullName"
          label="Nome completo"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          density="comfortable"
          color="var(--color-primary)"
          clearable
          required
        />

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

        <!-- Termos -->
        <v-checkbox
          v-model="acceptedTerms"
          color="var(--color-primary)"
          class="mt-1"
          required
        >
          <template #label>
            <span>
              Eu aceito os
              <span
                style="color: var(--highlight-color); cursor: pointer;"
                @click.prevent="openTerms"
              >
                termos e condições
              </span>
            </span>
            <!-- Transition Wrapper -->
  <transition name="slide-fade" mode="out-in">
    <component :is="currentComponent" />
  </transition>
</template>
        </v-checkbox>

        <!-- Criar Conta -->
        <v-btn
          block
          class="py-3 mt-2 animate-button-pulse"
          :style="{
            backgroundColor: 'var(--button-primary-bg)',
            color: 'var(--button-primary-text)'
          }"
          type="submit"
        >
          Criar conta
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>

        <!-- Divider -->
        <div class="d-flex align-center my-4">
          <v-divider class="flex-grow-1"></v-divider>
          <span class="mx-3" style="color: var(--text-secondary);">ou</span>
          <v-divider class="flex-grow-1"></v-divider>
        </div>

        <!-- Já tenho conta -->
        <v-btn
          block
          class="py-3 animate-fade-in-delayed"
          variant="outlined"
          :style="{
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)'
          }"
          @click="handleLoginClick"
        >
          <v-icon start>mdi-login</v-icon>
          Já tenho conta
        </v-btn>

      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import back from '../assets/GrãosdeCaféemDetalhe.png';
import logo from '../assets/LogoCoffeeQueue.png';
import router from "../routes/Routes";

const formData = ref({ fullName: "", email: "", password: "" });
const acceptedTerms = ref(false);

const handleSubmit = () => console.log("Registration data:", formData.value);
const handleLoginClick = () => router.push('/login')//console.log("Navigate to login page");
const openTerms = () => console.log("Open Terms & Conditions");
// ADD COMPONENT SWITCHING
// const currentComponent = ref('RegisterForm'); // or 'LoginForm'

// const goToLogin = () => {
//   currentComponent.value = 'LoginForm';
// };

// const goToRegister = () => {
//   currentComponent.value = 'RegisterForm';
// };

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

.form-card {
  position: relative;
  width: 95%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.title {
  color: var(--color-primary);
}

.subtitle {
  color: var(--text-secondary);
}

.terms {
  color: var(--highlight-color);
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
}

.btn-outline {
  border-color: var(--color-primary) !important;
  color: var(--color-primary) !important;
}

/* Space Y */
.space-y > * + * {
  margin-top: 18px;
}

/* Responsividade */
@media (max-width: 768px) {
  .form-card {
    padding: 24px !important;
  }
}
  .logo-img {
    width: 120px;
    opacity: 0.95;
  }

  /* ANIMAÇÕES */
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
    animation: pulse 2s infinite ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }

/* PAGE TRANSITIONS */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.45s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>
