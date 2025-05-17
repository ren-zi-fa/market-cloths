import axios from 'axios'

const instance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
   withCredentials: true // agar cookie (refresh_token) terkirim otomatis
})

let isRefreshing = false
let failedQueue: { resolve: (value?: any) => void; reject: (error?: any) => void }[] = []

const processQueue = (error: any, token: string | null = null) => {
   failedQueue.forEach(prom => {
      if (error) {
         prom.reject(error)
      } else {
         prom.resolve(token)
      }
   })
   failedQueue = []
}

instance.interceptors.response.use(
   response => response,
   async error => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true

         if (isRefreshing) {
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject })
            })
               .then(token => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`
                  return instance(originalRequest)
               })
               .catch(err => Promise.reject(err))
         }

         isRefreshing = true

         try {
            // Panggil endpoint refresh token
            const res = await instance.post('/refresh-token')

            // Asumsikan server mengembalikan access token baru di res.data.access_token
            const newAccessToken = res.data.access_token

            // Update header Authorization untuk request asli
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

            processQueue(null, newAccessToken)

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
