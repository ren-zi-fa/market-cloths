import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  hasRefreshToken: boolean
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  checkTokens: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hasRefreshToken: false,

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }
    set({ accessToken: token })
  },

  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem('refresh_token', token)
    } else {
      localStorage.removeItem('refresh_token')
    }
    set({ 
      refreshToken: token,
      hasRefreshToken: token !== null
    })
  },

  checkTokens: () => {
    const storedAccessToken = localStorage.getItem('access_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    set({ 
      accessToken: storedAccessToken, 
      refreshToken: storedRefreshToken,
      hasRefreshToken: storedRefreshToken !== null
    })
  },
}))
