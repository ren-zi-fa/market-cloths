import axios from 'axios'
import jwt from 'jsonwebtoken'

const instance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Fungsi helper untuk ambil token dari localStorage
const getAccessToken = () => {
   const token = localStorage.getItem('access_token')
   return token
}

const getRefreshToken = () => {
   const token = localStorage.getItem('refresh_token')
   return token
}
const setAccessToken = (token: string) =>
   localStorage.setItem('access_token', token)

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
      }
   }
   getRefreshToken()
   return config
})

instance.interceptors.response.use(
   (response) => {
      return response
   },
   async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true

         const token = getAccessToken()
         const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET

         let isExpired = true
         if (token && jwtSecret) {
            try {
               jwt.verify(token, jwtSecret)
               isExpired = false
            } catch (err: any) {
               if (err.name === 'TokenExpiredError') {
                  isExpired = true
               }
            }
         }

         if (!isExpired) {
            return Promise.reject(error)
         }

         if (isRefreshing) {
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

            const newAccessToken = response.headers['access_token']
            if (!newAccessToken)
               throw new Error(
                  'Access token baru tidak ditemukan di header response'
               )

            setAccessToken(newAccessToken)

            processQueue(null, newAccessToken)

            originalRequest.headers['Authorization'] =
               `Bearer ${newAccessToken}`
            return instance(originalRequest)
         } catch (err) {
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
