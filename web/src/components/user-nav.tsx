'use client'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User } from '@/types'
import { UserRound } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

type UserProps = Omit<User, 'tokenType' | 'iat' | 'exp'>
interface UserNavProps {
   user?: UserProps | null
   loading: boolean
   onLogout: () => void
}
export default function UserNav({ user, loading, onLogout }: UserNavProps) {
   const router = useRouter()
   return (
      <div className="w-full">
         <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
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
                     <Button
                        onClick={() => router.push('/dashboard')}
                        className="w-full"
                        variant="outline"
                     >
                        Dashboard
                     </Button>
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
                     <Button
                        onClick={() => router.push('/auth/login')}
                        className="w-full"
                     >
                        Login
                     </Button>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}
