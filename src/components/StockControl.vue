<template>
  <v-card class="pa-4 rounded-xl" :style="cardStyle" elevation="1">
    <div class="d-flex align-center mb-3">
      <v-icon size="22" color="var(--color-primary)">mdi-package-variant</v-icon>
      <span class="ml-3 text-subtitle-2">Controle de Estoque</span>
    </div>

    <p class="text-caption mb-4 text-secondary">Níveis atuais e previsões</p>

    <div class="d-flex flex-column ga-4">
      <div
        v-for="item in items"
        :key="item.name"
        class="pa-4 rounded-lg"
        :class="item.isLow ? 'low-stock' : 'normal-stock'"
      >
        <!-- Linha superior -->
        <div class="d-flex justify-space-between mb-2 align-center">
          <div class="d-flex align-center ga-2">
            <strong>{{ item.name }}</strong>
            <v-icon
              v-if="item.isLow"
              size="18"
              color="var(--error-color)"
            >
              mdi-alert
            </v-icon>
          </div>

          <span :style="{ color: item.statusColor }">
            {{ item.current }} {{ item.unit }}
          </span>
        </div>

        <!-- Barra de progresso -->
        <v-progress-linear
          height="8"
          rounded
          :model-value="item.percentage"
          :color="item.barColor"
        />

        <!-- Infos inferior -->
        <div class="d-flex justify-space-between text-caption mt-2 text-secondary">
          <span>{{ item.percentage.toFixed(0) }}% do estoque</span>
          <span>Máx: {{ item.max }} {{ item.unit }}</span>
        </div>

        <div class="d-flex justify-space-between text-caption mt-1 text-secondary">
          <div class="d-flex align-center ga-1">
            <v-icon size="14">mdi-trending-down</v-icon>
            <span>{{ item.weeklyConsumption }} {{ item.unit }}/semana</span>
          </div>
          <span :class="item.isLow ? 'text-error' : ''">
            ~{{ item.daysRemaining }} dias restantes
          </span>
        </div>
      </div>
    </div>

    <!-- Alerta geral -->
    <div class="mt-5 pt-3" style="border-top: 1px solid var(--border-color);">
      <v-alert
        type="error"
        variant="tonal"
        border="start"
        color="var(--error-color)"
        elevation="0"
      >
        Grãos de Café e Açúcar precisam de reposição em breve.
      </v-alert>
    </div>
  </v-card>
</template>

<script setup lang="ts">
const cardStyle = `
  background: var(--background-surface);
  border: 1px solid var(--border-color);
`

// Mock temporário até você enviar os dados do backend
const items = [
  { name: 'Grãos de Café', current: 3.5, max: 10, unit: 'kg', weeklyConsumption: 2.1, daysRemaining: 12 },
  { name: 'Leite', current: 8, max: 20, unit: 'L', weeklyConsumption: 5.2, daysRemaining: 11 },
  { name: 'Açúcar', current: 1.2, max: 5, unit: 'kg', weeklyConsumption: 0.8, daysRemaining: 10 },
  { name: 'Copos Descartáveis', current: 150, max: 500, unit: 'un', weeklyConsumption: 98, daysRemaining: 11 },
].map(item => {
  const percentage = (item.current / item.max) * 100
  return {
    ...item,
    percentage,
    isLow: percentage <= 25,
    statusColor:
      percentage <= 25
        ? 'var(--error-color)'
        : percentage <= 50
        ? 'var(--warning-color)'
        : 'var(--success-color)',
    barColor:
      percentage <= 25
        ? 'var(--error-color)'
        : percentage <= 50
        ? 'var(--warning-color)'
        : 'var(--success-color)',
  }
})
</script>

<style scoped>
.low-stock {
  background: var(--error-color);
  background: rgba(217, 83, 79, 0.1);
  border: 1px solid var(--error-color);
}

.normal-stock {
  background: var(--color-gray-soft);
  border: 1px solid var(--border-color);
}

.text-secondary {
  color: var(--text-secondary);
}

.text-error {
  color: var(--error-color);
}
</style>
