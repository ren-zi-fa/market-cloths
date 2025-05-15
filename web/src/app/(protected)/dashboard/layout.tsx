import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
   children
}: {
   children: React.ReactNode
}) {
   return (
         <SidebarProvider>
             <AppSidebar variant="inset" />
             <SidebarInset>
               {children}
             </SidebarInset>
          </SidebarProvider>
   )
}
