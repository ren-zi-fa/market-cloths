import { useEffect, useState } from 'react'
import instance from '@/lib/axios'

type User = {
   userId: string
   email: string
   username: string
   makanan_favorite: string
   role: 'admin' | 'user'
}
export function useProfile() {
   const [user, setUser] = useState<User | null>(null)
   const [loading, setLoading] = useState(true)


   useEffect(() => {
      instance
         .get('/api/auth/profile')
         .then((res) => setUser(res.data.user))
         .catch(() => setUser(null))
         .finally(() => setLoading(false))
   }, [])

   return { user, loading, }
}
