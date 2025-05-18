'use client'

import { Button } from '@/components/ui/button'
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger
} from '@/components/ui/drawer'
import { ShoppingBag } from 'lucide-react'

export default function CheckoutCart({ cartCount }: { cartCount: number }) {
   return (
      <Drawer>
         <DrawerTrigger asChild>
            <button className="relative">
               <ShoppingBag className="w-6 h-6" />
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
               </span>
            </button>
         </DrawerTrigger>

         <DrawerContent>
            <DrawerHeader>
               <DrawerTitle>Your Shopping Cart</DrawerTitle>
               <DrawerDescription>
                  Review your items before checkout.
               </DrawerDescription>
            </DrawerHeader>

            {/* TODO: Tampilkan daftar isi cart di sini */}

            <DrawerFooter>
               <Button>Checkout</Button>
               <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
               </DrawerClose>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   )
}
