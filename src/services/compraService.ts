import api from '../controller/api.controller'
import type { Compra, ApiResponse } from './tipos'

export default {
  async listar() {
    return api.get<ApiResponse<Compra[]>>('/compra')
  },

  async criar(dados: { usuario_id: number; cafe_qnd: number; filtro_qnd: number }) {
    return api.post<ApiResponse<Compra>>('/compra/criar', dados)
  },

  async atualizar(id: number, dados: Partial<Compra>) {
    return api.put<ApiResponse<Compra>>(`/compra/atualizar/${id}`, dados)
  },

  async remover(id: number) {
    return api.delete<ApiResponse<null>>(`/compra/deletar/${id}`)
  },
}