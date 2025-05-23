'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import instance from '@/lib/axios'
import Image from 'next/image'
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { Iproduct } from '@/types'

type Product = Iproduct

export default function ProductDetailPage() {
   const params = useParams()
   const productId = params.productId as string
   const [product, setProduct] = useState<Product | null>(null)
   const [loading, setLoading] = useState(true)
   const { addToCart, cart } = useCart()

   // Cek apakah produk sudah ada di keranjang
   const isInCart = cart?.some((item) => item.id === product?.id)

   useEffect(() => {
      if (!productId) return
      setLoading(true)
      instance
         .get(`/api/products/${productId}`)
         .then((res) => setProduct(res.data.data))
         .catch(() => setProduct(null))
         .finally(() => setLoading(false))
   }, [productId])

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <span className="text-muted-foreground">Loading...</span>
         </div>
      )
   }

   if (!product) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <span className="text-destructive">Produk tidak ditemukan.</span>
         </div>
      )
   }

   return (
      <div className="flex justify-center items-center min-h-screen px-4">
         <Card className="w-full max-w-4xl grid md:grid-cols-2 gap-6 p-6 shadow-xl">
            {product.image_url?.[0] && (
               <div className="flex items-center justify-center">
                  <Image
                     src={product.image_url[0]}
                     alt={product.name}
                     width={400}
                     height={300}
                     className="rounded-lg object-cover border"
                     style={{ background: '#f4f4f5' }}
                     priority
                  />
               </div>
            )}

            <div className="flex flex-col justify-between">
               <CardHeader>
                  <CardTitle className="text-3xl">{product.name}</CardTitle>
                  <Badge variant="outline" className="capitalize mt-2">
                     {product.category_name}
                  </Badge>
               </CardHeader>
               <CardContent className="flex flex-col gap-4">
                  <div className="text-xl font-semibold text-primary">
                     Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                  <div className="flex items-center gap-2 text-sm">
                     <span className="font-medium">Stok:</span>
                     <span
                        className={
                           product.stok > 0
                              ? 'text-green-600 font-semibold'
                              : 'text-destructive font-semibold'
                        }
                     >
                        {product.stok > 0 ? product.stok : 'Habis'}
                     </span>
                  </div>
                  <Button
                     className="w-full"
                     disabled={product.stok <= 0 || isInCart}
                     onClick={() => addToCart(product)}
                  >
                     {product.stok <= 0
                        ? 'Stok Habis'
                        : isInCart
                        ? 'has been added to cart'
                        : 'Add To Cart'}
                  </Button>
               </CardContent>
            </div>
         </Card>
      </div>
   )
}