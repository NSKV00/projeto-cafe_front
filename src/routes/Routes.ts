import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login.vue'
import Cadastro from '../pages/Cadastro.vue'
import Dashboard from '../pages/Dashboard.vue'
import AdminDashboard from "../pages/AdminDashboard.vue"
import Perfil from "../pages/Perfil.vue"

const routes = [
  { path: '/', component: Dashboard, meta: { requiresAuth: false } },
  { path: '/login', component: Login },
  { path: '/cadastro', component: Cadastro },
  { path: '/admin', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/perfil', component: Perfil, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token')
  const requiresAuth = to.meta.requiresAuth
  const isAdmin = localStorage.getItem('is_admin') === '1'

  if (requiresAuth && !token) {
    return next('/login')
  }

  if (to.path === '/admin' && !isAdmin) {
    return next('/')
  }

  if ((to.path === '/login' || to.path === '/cadastro') && token) {
    return next('/')
  }

  return next()
})

export default router