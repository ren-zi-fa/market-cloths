import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export default function DashboardLayout({
   children
}: {
   children: React.ReactNode
}) {
   return (
      <SidebarProvider>
         <AppSidebar variant="inset" />
         <SidebarInset>
            <Toaster />
            {children}
         </SidebarInset>
      </SidebarProvider>
   )
}
