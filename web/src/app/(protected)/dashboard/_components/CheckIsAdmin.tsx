'use client'

import { useEffect } from 'react'

import { ReactNode } from 'react'
import { User } from '@/types'
import { jwtDecode } from 'jwt-decode'
import { redirect } from 'next/navigation'

type JwtPayload = User

export default function CheckIsAdmin({ children }: { children: ReactNode }) {
   useEffect(() => {
      const token = localStorage.getItem('access_token')
      if (!token) {
         redirect('/auth/login')
      }

      try {
         const decoded = jwtDecode<JwtPayload>(token)

         // Cek apakah expired
         if (decoded.exp * 1000 < Date.now()) {
            redirect('/auth/login')
         }

         // Cek role
         if (decoded.role !== 'admin') {
            redirect('/auth/login')
         }
      } catch (err) {
         console.log(err)
         redirect('/auth/login')
      }
   }, [])

   return <>{children}</>
}
