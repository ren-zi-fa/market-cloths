'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import instance from '@/lib/axios'

export default function RefreshPage() {
   const router = useRouter()

   useEffect(() => {
      instance
         .post(
            '/api/auth/refresh-token',
            {},
            {
               withCredentials: true
            }
         )

         .then(() => router.replace('/dashboard'))
         .catch(() => router.replace('/auth/login'))
   }, [router])

   return <div>Menyegarkan sesi...</div>
}
