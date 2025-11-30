// filaService.ts
import api from '../controller/api.controller'

export default {
  listar() {
    return api.get('/fila')
  },

  proximo() {
    return api.get('/fila/proximo')
  },

  posicaoUsuario(id: number) {
    return api.get(`/fila/posicao/${id}`)
  }
}
