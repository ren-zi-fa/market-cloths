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
import { useCart } from '@/hooks/use-cart'
import { useProfile } from '@/hooks/use-profile'
import { Iproduct } from '@/types'
import { ShoppingBag } from 'lucide-react'

interface CheckoutCartProps {
   cartCount: number
}

export default function CheckoutCart({ cartCount }: CheckoutCartProps) {
   const { cart: carts, setCart, removeFromCart } = useCart()
   const { user, loading } = useProfile()

   // Fungsi untuk mengurangi quantity
   const decreaseQuantity = (productId: string) => {
      const index = carts.findIndex((item) => item.id === productId)
      if (index !== -1) {
         const filtered = [...carts]
         filtered.splice(index, 1)
         if (filtered.filter((item) => item.id === productId).length === 0) {
            removeFromCart(productId)
         } else {
            setCart(filtered)
         }
      }
   }

   // Fungsi untuk menambah quantity dengan batas stok
   const increaseQuantity = (productId: string, stok: number) => {
      const currentQty = carts.filter((item) => item.id === productId).length
      if (currentQty < stok) {
         const productToAdd = carts.find((item) => item.id === productId)
         if (productToAdd) {
            setCart([...carts, productToAdd])
         }
      }
   }

   // Mengelompokkan produk berdasarkan ID
   const cartMap = new Map<string, { product: Iproduct; qty: number }>()
   carts.forEach((item) => {
      if (cartMap.has(item.id)) {
         cartMap.get(item.id)!.qty += 1
      } else {
         cartMap.set(item.id, { product: item, qty: 1 })
      }
   })
   const groupedCarts = Array.from(cartMap.values())

   // Hitung total harga
   const totalPrice = groupedCarts.reduce(
      (total, { product, qty }) => total + product.price * qty,
      0
   )

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
               <div className="grid grid-cols-6 items-center">
                  <div className="p-4 space-y-4 h-auto overflow-y-auto max-h-[60vh] col-span-4">
                     {groupedCarts.length === 0 ? (
                        <p className="text-center text-gray-500">
                           Your cart is empty.
                        </p>
                     ) : (
                        groupedCarts.map(({ product, qty }) => (
                           <div
                              key={product.id}
                              className="flex items-center gap-4 border rounded-lg p-3"
                           >
                              <img
                                 src={
                                    product.image_url[0] || '/placeholder.jpg'
                                 }
                                 alt={product.name}
                                 className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                 <h3 className="text-sm font-medium">
                                    {product.name}
                                 </h3>
                                 <p className="text-sm text-gray-600">
                                    ${product.price.toFixed(2)}
                                 </p>
                                 <p className="text-xs text-gray-400">
                                    Stock: {product.stok} | Quantity: {qty}
                                 </p>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => decreaseQuantity(product.id)}
                                 >
                                    −
                                 </Button>
                                 <Button
                                    size="sm"
                                    onClick={() =>
                                       increaseQuantity(
                                          product.id,
                                          product.stok
                                       )
                                    }
                                    disabled={qty >= product.stok}
                                 >
                                    +
                                 </Button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
                  <div className="px-6 py-4 flex-col gap-4 space-y-4 justify-between items-center text-lg font-semibold col-span-2">
                     {loading ? (
                        'loading...'
                     ) : (
                        <>
                           <div className="">Nama:{user?.username}</div>
                           <div className="">Email:{user?.email}</div>
                        </>
                     )}
                     <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-4">
                           <span>Total:</span>
                           <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                           <Button disabled={groupedCarts.length === 0}>
                              Checkout
                           </Button>
                           <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                           </DrawerClose>
                        </div>
                     </div>
                  </div>
               </div>
            </DrawerHeader>

            {/* Tampilkan total harga */}
         </DrawerContent>
      </Drawer>
   )
}
