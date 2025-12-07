export interface Usuario {
  id: number
  nome: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface Fila {
  id: number
  usuario_id: number
  usuario?: Usuario
  posicao?: number
  created_at?: string
  updated_at?: string
}

export interface Compra {
  id: number
  usuario_id: number
  fila_id?: number
  cafe_qnd: number
  filtro_qnd: number
  usuario?: Usuario
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  status?: 'pending' | 'completed' | 'cancelled'
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  code: number
}

export interface AuthResponse {
  token: string
  user: Usuario
}
