'use client'

import { Button } from '@/components/ui/button'
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger
} from '@/components/ui/drawer'
import { useCart } from '@/hooks/use-cart'
import { formatRupiah } from '@/lib/formatRupiah'
import { Iproduct } from '@/types'
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface CheckoutCartProps {
   cartCount: number
}

export default function CheckoutCart({ cartCount }: CheckoutCartProps) {
   const { cart: carts, setCart, removeFromCart } = useCart()

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

   const increaseQuantity = (productId: string, stok: number) => {
      const currentQty = carts.filter((item) => item.id === productId).length
      if (currentQty < stok) {
         const productToAdd = carts.find((item) => item.id === productId)
         if (productToAdd) {
            setCart([...carts, productToAdd])
         }
      }
   }
   const handlePay = async () => {
      const res = await fetch('/api/midtrans-token', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            amount: totalPrice,
            name: 'Pembeli',
            email: 'pembeli@email.com'
         })
      })

      const data = await res.json()

      if (data?.token) {
         // @ts-expect-error snap tidak terdefinisi di typings, tapi tersedia setelah script dimuat
         window.snap.pay(data.token, {
            onSuccess: (result: any) => {
               console.log('Pembayaran sukses', result)
               alert('Pembayaran berhasil!')
               setCart([])
            },
            onPending: (result: any) => {
               console.log('Menunggu pembayaran', result)
               alert('Menunggu pembayaran...')
            },
            onError: (result: any) => {
               console.error('Terjadi kesalahan', result)
               alert('Terjadi kesalahan saat pembayaran')
            },
            onClose: () => {
               console.log('Popup ditutup tanpa pembayaran')
            }
         })
      } else {
         alert('Gagal membuat token pembayaran')
      }
   }

   const cartMap = new Map<string, { product: Iproduct; qty: number }>()
   carts.forEach((item) => {
      if (cartMap.has(item.id)) {
         cartMap.get(item.id)!.qty += 1
      } else {
         cartMap.set(item.id, { product: item, qty: 1 })
      }
   })
   const groupedCarts = Array.from(cartMap.values())

   const totalPrice = groupedCarts.reduce(
      (total, { product, qty }) => total + product.price * qty,
      0
   )

   useEffect(() => {
      const script = document.createElement('script')
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
      script.setAttribute(
         'data-client-key',
         process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
      )
      document.body.appendChild(script)
      return () => {
         document.body.removeChild(script)
      }
   }, [])

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

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-4 pb-6">
               {/* Produk */}
               <div className="space-y-4 col-span-4 max-h-[35vh] md:max-h-[40vh] overflow-y-auto pr-2">
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
                           <Image
                              width={200}
                              height={200}
                              src={product.image_url[0] || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                           />
                           <div className="flex-1">
                              <h3 className="text-sm font-medium">
                                 {product.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                 {formatRupiah(product.price)}
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
                                    increaseQuantity(product.id, product.stok)
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

               {/* Info user & total */}
               <div className="col-span-2 flex flex-col gap-4 text-sm md:text-lg font-semibold">
                  <div className="flex justify-between">
                     <span>Total:</span>
                     <span>{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                     <Button
                        className="flex-1"
                        disabled={groupedCarts.length === 0}
                        onClick={handlePay}
                     >
                        Bayar
                     </Button>

                     <DrawerClose asChild>
                        <Button className="flex-1" variant="outline">
                           Cancel
                        </Button>
                     </DrawerClose>
                  </div>
               </div>
            </div>
         </DrawerContent>
      </Drawer>
   )
}
