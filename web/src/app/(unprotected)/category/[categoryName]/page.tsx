'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

import { useCart } from '@/hooks/use-cart'
import { Iproduct } from '@/types'

type Product = Iproduct

export default function Category() {
   const params = useParams()
   const categoryName = params.categoryName as string
   const [products, setProducts] = useState<Product[]>([])
   const [loading, setLoading] = useState<boolean>(true)

   const { addToCart } = useCart()

   useEffect(() => {
      const fetchProducts = async () => {
         setLoading(true)
         try {
            const res = await fetch(
               `https://market-cloths.vercel.app/api/products?category=${categoryName}`
            )
            const data = await res.json()
            if (data.success) {
               setProducts(data.data)
            }
         } catch (error) {
            console.error('Failed to fetch products:', error)
         } finally {
            setLoading(false)
         }
      }

      if (categoryName) {
         fetchProducts()
      }
   }, [categoryName])

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            Loading...
         </div>
      )
   }

   return (
      <div className="px-4 py-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
         {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
               <div className="relative w-full h-60">
                  <Image
                     src={product.image_url[0]}
                     alt={product.name}
                     fill
                     className="rounded-t-2xl object-cover"
                  />
               </div>

               <CardContent className="flex-1 flex flex-col gap-2 pt-4">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-md font-bold mt-2">
                     Rp {product.price.toLocaleString()}
                  </p>
               </CardContent>

               <CardFooter>
                  <Button className="w-full" onClick={() => addToCart(product)}>
                     Tambahkan ke Keranjang
                  </Button>
               </CardFooter>
            </Card>
         ))}
      </div>
   )
}
