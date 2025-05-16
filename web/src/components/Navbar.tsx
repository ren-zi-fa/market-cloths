import { AlignLeft, Heart, ShoppingBag, UserRound } from 'lucide-react'
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
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export default function Navbar() {
   return (
      <header className="sticky top-0 z-50 w-full px-2 md:px-8 bg-white/30 backdrop-blur">
         <div className="container flex h-16 items-center gap-4 mx-auto justify-between">
            {/* Kiri: SheetTrigger dan Nav Links */}
            <div className="flex items-center gap-3">
               {/* SheetTrigger di kiri */}
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
            {/* Logo tengah hanya di desktop */}
            <Link href="/" className="hidden md:flex">
               <Image src={Logom} alt="logo" priority />
            </Link>
            {/* Kanan: Icon (desktop) */}
            <div className="hidden md:flex items-center space-x-8">
               <Heart />
               <ShoppingBag />
               <div className="">
                  <DropdownMenu>
                     <DropdownMenuTrigger>
                        <UserRound />
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
            {/* Logo kanan hanya di mobile */}
            <Link href="/" className="flex md:hidden ml-auto">
               <Image src={Logom} priority alt="logo" className="h-8 w-auto" />
            </Link>
         </div>
      </header>
   )
}
