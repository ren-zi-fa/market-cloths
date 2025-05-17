import axios from 'axios'

const instance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
   withCredentials: true // agar cookie terkirim
})

export default instance
