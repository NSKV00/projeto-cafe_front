import api from '../controller/api.controller'
import type { AuthResponse, ApiResponse } from './tipos'

export default {
  async login(email: string, senha: string) {
    return api.post<ApiResponse<AuthResponse>>('/login', { email, senha })
  },

  async verificarToken() {
    return api.post('/login/verificarToken')
  },

  async logout() {
    return api.post('/logout')
  },
}