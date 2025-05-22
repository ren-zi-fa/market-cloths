'use client'

import { AlignLeft } from 'lucide-react'
import { Nav_Links } from '@/constants/navbar'
import {
   Sheet,
   SheetContent,
   SheetTrigger,
   SheetHeader,
   SheetTitle,
   SheetDescription,
   SheetClose
} from '@/components/ui/sheet'
import Link from 'next/link'
import Logom from '@/assets/logo.png'
import Image from 'next/image'

import { useProfile } from '@/hooks/use-profile'
import instance from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import UserNav from './user-nav'
import CheckoutCart from '@/app/(unprotected)/_components/checkoutCart'
import { useAuthStore } from '@/hooks/use-auth'

export default function Navbar() {
   const { user, loading } = useProfile()
   const router = useRouter()
   const { cartCount } = useCart()
   const { setAccessToken, setRefreshToken } = useAuthStore()
   const onLogout = async () => {
      await instance.post('/api/auth/logout')
      setRefreshToken(null)
      setAccessToken(null)
      router.replace('/auth/login')
   }

   return (
      <header className="sticky top-0 z-50 w-full px-2 md:px-8 bg-white/30 backdrop-blur">
         <div className="container flex h-16 items-center gap-4 mx-auto justify-between">
            {/* Kiri: navigasi dan menu */}
            <Link href="/" className="hidden md:flex">
               <Image src={Logom} alt="logo" priority />
            </Link>
            <div className="flex items-center gap-3">
               <Sheet>
                  <SheetTrigger className="md:hidden" asChild>
                     <button>
                        <AlignLeft />
                     </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="py-10">
                     <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                        <SheetDescription>Navigasi utama</SheetDescription>
                     </SheetHeader>
                     <div className="flex flex-col gap-6 mt-8">
                        {Nav_Links.map((items, i) => (
                           <SheetClose asChild key={i}>
                              <Link
                                 href={items.path}
                                 className="hover:text-black font-medium text-xl text-purple-600"
                              >
                                 {items.title}
                              </Link>
                           </SheetClose>
                        ))}
                     </div>
                  </SheetContent>
               </Sheet>
               <nav className="hidden md:flex items-center gap-6">
                  {Nav_Links.map((item, i) => (
                     <Link
                        key={i}
                        href={item.path}
                        className="hover:text-purple-500 font-medium"
                     >
                        {item.title}
                     </Link>
                  ))}
               </nav>
            </div>

            {/* Logo tengah desktop */}

            {/* Kanan: checkoutCart selalu render sekali */}
            <div className="flex items-center space-x-6 md:space-x-8 ml-auto">
               <CheckoutCart cartCount={cartCount} />

               {/* Desktop: UserNav */}
               <div className="hidden md:flex">
              
                     <UserNav
                        loading={loading}
                        onLogout={onLogout}
                        user={user}
                     />
              
               </div>

               {/* Mobile: Logo */}
               <div className="md:hidden">
                  <Link href="/">
                     <Image
                        src={Logom}
                        priority
                        alt="logo"
                        className="h-8 w-auto"
                     />
                  </Link>
               </div>
            </div>
         </div>
      </header>
   )
}
