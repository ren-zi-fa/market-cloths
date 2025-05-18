import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Link, UserRound } from 'lucide-react'

interface UserNavProps {
   user: any
   loading: any
   onLogout:()=>void
}
export default function UserNav({ user, loading,onLogout }: UserNavProps) {
   return (
      <div className="">
         <DropdownMenu>
            <DropdownMenuTrigger className="flex">
               <UserRound />
               {user ? user.username.slice(0, 3) : 'Guest'}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuLabel>
                  {loading
                     ? 'Loading...'
                     : user
                       ? `Hi, ${user.username}`
                       : 'Guest'}
               </DropdownMenuLabel>
               <DropdownMenuLabel>
                  {loading ? (
                     'Loading...'
                  ) : user && user.role === 'admin' ? (
                     <Link href="/dashboard">Dashboard</Link>
                  ) : null}
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               {user ? (
                  <>
                     <DropdownMenuItem>Profile</DropdownMenuItem>
                     <DropdownMenuItem onClick={onLogout}>
                        Logout
                     </DropdownMenuItem>
                  </>
               ) : (
                  <DropdownMenuItem asChild>
                     <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}
