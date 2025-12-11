import api from '../controller/api.controller'
import type { Fila, ApiResponse } from './tipos'

export default {
  async listar() {
    return api.get<ApiResponse<Fila[]>>('/fila')
  },

  async criar(usuario_id: number) {
    return api.post<ApiResponse<Fila>>(`/fila/criar/${usuario_id}`, { usuario_id })
  },

  async proximo() {
    try {
      const res = await api.get<ApiResponse<Fila>>('/fila/proximo')
      // Retorna exatamente o response do axios para manter consistência
      return res
    } catch (err: any) {
      // Não propagar erro não tratado — retornamos um objeto normalizado parecido com ResponseService
      console.error('filaService.proximo erro', err)
      return {
        data: {
          success: false,
          data: null,
          message: err?.response?.data?.message ?? err?.message ?? 'Erro ao obter próximo da fila',
          code: err?.response?.status ?? 500,
        },
      } as any
    }
  },

  async posicaoUsuario(id: number) {
    return api.get<ApiResponse<{ posicao: number }>>(`/fila/posicao/${id}`)
  },

  async remover(id: number) {
    return api.delete<ApiResponse<null>>(`/fila/deletar/${id}`)
  },
}