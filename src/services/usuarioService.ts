import api from '../controller/api.controller'
import type { Usuario, ApiResponse } from './tipos'

export default {
  async listar() {
    return api.get<ApiResponse<Usuario[]>>('/usuario')
  },

  async criar(dados: { nome: string; email: string; senha: string }) {
    return api.post<ApiResponse<Usuario>>('/usuario/criar', dados)
  },

  async atualizar(id: number, dados: Partial<Usuario>) {
    return api.put<ApiResponse<Usuario>>(`/usuario/atualizar/${id}`, dados)
  },

  async atualizarAcesso(id: number, dados: { acesso: 'usuario' | 'admin' }) {
    return api.put<ApiResponse<Usuario>>(`/usuario/atualizarAcesso/${id}`, dados)
  },

  async obter(id: number) {
    return api.get<ApiResponse<Usuario>>(`/usuario/${id}`)
  },
}