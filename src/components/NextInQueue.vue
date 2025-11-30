<template>
  <v-card class="pa-5 rounded-xl" :style="featuredStyle" elevation="3">
    <div class="d-flex align-center mb-4">
      <v-icon color="white">mdi-account</v-icon>
      <span class="ml-2 text-white text-body-2">Próximo da Fila</span>
    </div>

    <div class="mb-6">
      <div class="d-flex align-center">
        <v-avatar size="48" color="white" class="mr-3" style="opacity: 0.25">
          <span class="text-h5">1</span>
        </v-avatar>
        <p class="text-h4 text-white">{{ firstUser?.usuario?.nome }}</p>
      </div>
    </div>

    <div class="d-flex flex-wrap justify-space-between pt-4" style="border-top: 1px solid #ffffff40">
      <v-card
        v-for="p in queue.slice(1, 5)"
        :key="p.id"
        class="pa-3 text-center mb-2"
        :style="smallCardStyle"
      >
        <v-avatar size="32" color="white" class="mb-2" style="opacity: 0.25">
          {{ p.posicao }}
        </v-avatar>
        <p class="text-caption text-white">{{ p.usuario?.nome }}</p>
      </v-card>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import filaService from '../services/filaService'

const queue = ref<any[]>([])
const firstUser = ref<any>(null)

const featuredStyle = `
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border: 2px solid var(--color-primary-dark);
`

const smallCardStyle = `
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  width: 85px;
`

onMounted(async () => {
  const all = await filaService.listar()
  queue.value = all.data.data

  const r = await filaService.proximo()
  firstUser.value = r.data.data
})
</script>
