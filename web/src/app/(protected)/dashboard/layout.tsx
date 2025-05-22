
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ProfileProvider } from '@/hooks/use-profile'
import CheckIsAdmin from './_components/CheckIsAdmin'
export default async function DashboardLayout({
   children
}: {
   children: React.ReactNode
}) {
   return (
      <SidebarProvider>
         <CheckIsAdmin>
            <ProfileProvider>
               <AppSidebar variant="inset" />
               <SidebarInset>{children}</SidebarInset>
            </ProfileProvider>
         </CheckIsAdmin>
      </SidebarProvider>
   )
}
