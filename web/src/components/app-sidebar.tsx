'use client'

import * as React from 'react'
import {
   FolderIcon,
   LayoutDashboardIcon,
   SettingsIcon,
   Shirt,
   UsersIcon
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem
} from '@/components/ui/sidebar'
import { useProfile } from '@/hooks/use-profile'
import Link from 'next/link'

const data = {
   navMain: [
      {
         title: 'Dashboard',
         url: '/dashboard',
         icon: LayoutDashboardIcon
      },
      {
         title: 'Product',
         url: '/dashboard/products',
         icon: Shirt
      },
      {
         title: 'Category',
         url: '/dashboard/categories',
         icon: FolderIcon
      },
      {
         title: 'Buyer',
         url: '#',
         icon: UsersIcon
      }
   ],
   navSecondary: [
      {
         title: 'Settings',
         url: '#',
         icon: SettingsIcon
      }
   ]
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const { user } = useProfile()
   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5"
                  >
                     <Link  href="/" target='_blank'>
                        <span className="text-base font-semibold">
                           Market-Cloths
                        </span>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
         </SidebarContent>
         <SidebarFooter>
            {user && <NavUser email={user.email} username={user.username} />}
         </SidebarFooter>
      </Sidebar>
   )
}
