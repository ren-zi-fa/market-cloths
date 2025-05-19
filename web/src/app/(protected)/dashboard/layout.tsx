import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { CategoryProvider } from '@/hooks/use-category'

export default async function DashboardLayout({
   children
}: {
   children: React.ReactNode
}) {

   return (
      <SidebarProvider>
         <AppSidebar variant="inset" />
         <CategoryProvider>
            <SidebarInset>{children}</SidebarInset>
         </CategoryProvider>
      </SidebarProvider>
   )
}
