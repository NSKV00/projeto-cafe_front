// compraService.ts
import api from '../controller/api.controller'

export default {
  listar() {
    return api.get('/compra')
  },
}
