import axios from 'axios'

const instance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
   withCredentials: true
})

let isRefreshing = false
let failedQueue: {
   resolve: (value?: any) => void
   reject: (error?: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
   failedQueue.forEach((prom) => {
      if (error) {
         prom.reject(error)
      } else {
         prom.resolve(token)
      }
   })
   failedQueue = []
}

instance.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true

         if (isRefreshing) {
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject })
            })
               .then((token) => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`
                  return instance(originalRequest)
               })
               .catch((err) => Promise.reject(err))
         }

         isRefreshing = true

         try {
            const res = await instance.post(
               '/api/auth/refresh-token',
               {},
               {
                  withCredentials: true
               }
            )
            console.log(res.data)
            processQueue(null, null)

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
