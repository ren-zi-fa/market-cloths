import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { User } from '@/types'
import { CategoryProvider } from '@/hooks/use-category'

export default async function DashboardLayout({
   children
}: {
   children: React.ReactNode
}) {
   const cookieStore = cookies()
   const refreshToken = (await cookieStore).get('refresh_token')?.value
   const accessToken = (await cookieStore).get('access_token')?.value

   if (!refreshToken || !accessToken) {
      redirect('/auth/login')
   }

   let role = null
   type Payload = User
   try {
      const payload: Payload = jwtDecode(accessToken)
      role = payload.role
   } catch (e) {
      console.log(e)
      redirect('/auth/login')
   }

   if (role !== 'admin') {
      redirect('/auth/login')
   }

   return (
      <SidebarProvider>
         <AppSidebar variant="inset" />
         <CategoryProvider>
            <SidebarInset>{children}</SidebarInset>
         </CategoryProvider>
      </SidebarProvider>
   )
}
