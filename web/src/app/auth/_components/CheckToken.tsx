'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const CheckAuth = ({ children }: { children: ReactNode }) => {
   useEffect(() => {
      const token_refresh = localStorage.getItem('refresh_token')
      if (token_refresh) {
         redirect('/')
      }
   }, [])

   return <>{children}</>
}

export default CheckAuth
