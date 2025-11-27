import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'
import Dashboard from '../pages/Dashboard.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router