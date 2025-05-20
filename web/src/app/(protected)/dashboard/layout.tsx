import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { User } from '@/types'
import { ProfileProvider } from '@/hooks/use-profile'

export default async function DashboardLayout({
   children
}: {
   children: React.ReactNode
}) {
   const cookieStore = cookies()
   const refreshToken = (await cookieStore).get('refresh_token')?.value
   const accessToken = (await cookieStore).get('access_token')?.value

   // Jika tidak ada refresh token, redirect ke login
   if (!refreshToken) {
      redirect('/auth/login')
   }

   let role = null
   type Payload = User
   try {
      if (accessToken) {
         const payload: Payload = jwtDecode(accessToken)
         role = payload.role
      }
      // Jika tidak ada accessToken, biarkan saja. Axios akan handle refresh otomatis.
   } catch (e) {
      // Jika token corrupt, redirect ke login
      console.log(e)
      redirect('/auth/login')
   }

   // Hanya admin yang boleh akses
   if (role && role !== 'admin') {
      redirect('/auth/login')
   }

   return (
      <SidebarProvider>
         <ProfileProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>{children}</SidebarInset>
         </ProfileProvider>
      </SidebarProvider>
   )
}
