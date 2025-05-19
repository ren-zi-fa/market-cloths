"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import instance from '@/lib/axios'

type User = {
   userId: string
   email: string
   username: string
   makanan_favorite: string
   role: 'admin' | 'user'
}

type ProfileContextType = {
   user: User | null
   loading: boolean
   setUser: (user: User | null) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      instance
         .get('/api/auth/profile')
         .then((res) => setUser(res.data.user))
         .catch(() => setUser(null))
         .finally(() => setLoading(false))
   }, [])

   return (
      <ProfileContext.Provider value={{ user, loading, setUser }}>
         {children}
      </ProfileContext.Provider>
   )
}

export function useProfile() {
   const context = useContext(ProfileContext)
   if (!context) {
      throw new Error('useProfile must be used within a ProfileProvider')
   }
   return context
}