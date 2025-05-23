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
   const { addToCart } = useCart()

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
         <div className="flex justify-center items-center min-h-[300px]">
            <span className="text-muted-foreground">Loading...</span>
         </div>
      )
   }

   if (!product) {
      return (
         <div className="flex justify-center items-center min-h-[300px]">
            <span className="text-destructive">Produk tidak ditemukan.</span>
         </div>
      )
   }

   return (
      <div className="h-screen">
      <div className="container px-4 mx-auto py-8 flex items-center justify-center">
         <Card className="w-full grid grid-cols-1 md:grid-cols-2 max-w-lg shadow-lg">
            <CardHeader>
               <div className="flex items-center gap-4">
                  {product.image_url?.[0] && (
                     <Image
                        src={product.image_url[0]}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="rounded-lg object-cover border"
                        style={{ background: '#f4f4f5' }}
                        priority
                     />
                  )}
                  <div>
                     <CardTitle className="text-2xl">{product.name}</CardTitle>
                     <Badge variant="outline" className="capitalize mt-2">
                        {product.category_name}
                     </Badge>
                  </div>
               </div>
            </CardHeader>
            <CardContent>
               <div className="text-lg font-semibold text-primary mb-2">
                  Rp {product.price.toLocaleString('id-ID')}
               </div>
               <CardDescription className="mb-4">
                  {product.description}
               </CardDescription>
               <div className="flex items-center gap-2 text-sm mb-4">
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
                  disabled={product.stok <= 0}
                  onClick={() => addToCart(product)}
               >
                  {product.stok > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
               </Button>
            </CardContent>
         </Card>
      </div>
      </div>
   )
}
