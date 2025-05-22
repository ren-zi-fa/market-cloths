import axios from 'axios'
import jwt from 'jsonwebtoken'

const instance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Fungsi helper untuk ambil token dari localStorage
const getAccessToken = () => {
   const token = localStorage.getItem('access_token')
   console.debug('[axios] getAccessToken:', token)
   return token
}

const getRefreshToken = () => {
   const token = localStorage.getItem('refresh_token')
   console.debug('[axios] getRefreshToken:', token)
   return token
}
const setAccessToken = (token: string) => {
   console.log('[axios] setAccessToken: New token:', token)
   localStorage.setItem('access_token', token)
}

let isRefreshing = false
let failedQueue: {
   resolve: (value?: any) => void
   reject: (error?: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
   failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
         reject(error)
      } else {
         resolve(token)
      }
   })
   failedQueue = []
}

instance.interceptors.request.use((config: any) => {
   // Jangan override header Authorization kalau sudah ada (misal request refresh token)
   const hasAuth =
      config.headers['Authorization'] || config.headers['authorization']
   if (!hasAuth) {
      const token = getAccessToken()
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`
         console.debug('[axios] Request with Authorization header:', config.headers)
      } else {
         console.debug('[axios] Request without token')
      }
   }
   getRefreshToken()
   return config
})

instance.interceptors.response.use(
   (response) => {
      console.debug('[axios] Response:', response)
      return response
   },
   async (error) => {
      const originalRequest = error.config
      console.warn('[axios] Response error:', error)

      if (error.response?.status === 401 && !originalRequest._retry) {
         console.warn('[axios] 401 detected, handling refresh logic')
         originalRequest._retry = true

         const token = getAccessToken()
         const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

         let isExpired = true
         if (token && jwtSecret) {
            try {
               jwt.verify(token, jwtSecret)
               console.debug('[axios] JWT token masih valid')
               isExpired = false
            } catch (err: any) {
               if (err.name === 'TokenExpiredError') {
                  console.warn('[axios] Token expired')
                  isExpired = true
               } else {
                  console.error('[axios] JWT verify error:', err)
               }
            }
         }

         if (!isExpired) {
            console.warn('[axios] Token valid tapi dapat 401, stop retry')
            return Promise.reject(error)
         }

         if (isRefreshing) {
            console.debug('[axios] Refresh in progress, queueing request')
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject })
            })
               .then((newToken) => {
                  originalRequest.headers['Authorization'] =
                     `Bearer ${newToken}`
                  return instance(originalRequest)
               })
               .catch((err) => Promise.reject(err))
         }

         isRefreshing = true
         console.debug('[axios] Starting token refresh')

         try {
            const refreshToken = getRefreshToken()
            if (!refreshToken) throw new Error('Refresh token tidak ditemukan')

            const response = await instance.post(
               '/api/auth/refresh-token',
               null,
               {
                  headers: {
                     Authorization: `Bearer ${refreshToken}`
                  }
               }
            )
            console.log('[axios] Refresh response headers:', response.headers)

            const newAccessToken = response.headers['access_token']
            console.log('[axios] newAccessToken:', newAccessToken)
            if (!newAccessToken)
               throw new Error(
                  'Access token baru tidak ditemukan di header response'
               )

            setAccessToken(newAccessToken)
            console.log('[axios] access_token updated in localStorage')

            processQueue(null, newAccessToken)

            originalRequest.headers['Authorization'] =
               `Bearer ${newAccessToken}`
            console.debug('[axios] Retrying original request with new token')
            return instance(originalRequest)
         } catch (err) {
            console.error('[axios] Refresh token failed:', err)
            processQueue(err, null)
            return Promise.reject(err)
         } finally {
            isRefreshing = false
         }
      }

      return Promise.reject(error)
   }
)

export default instance