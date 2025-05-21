'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button' // pastikan ada komponen Button
import { Iproduct } from '@/types'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/use-profile'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { formatRupiah } from '@/lib/formatRupiah'

export default function CardNew({ data }: { data: Iproduct[] }) {
   const { user } = useProfile()
   const router = useRouter()
   const { addToCart } = useCart()

   const handleAddToCart = (item: Iproduct) => {
      if (!user) {
         return router.push('/auth/login')
      }
      addToCart(item)
   }
   return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
         {data.map((item, index) => (
            <motion.div
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
            >
               <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 py-1">
                  <CardContent className="px-2 py-0 flex flex-col items-center">
                     <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-2">
                        <Image
                           src={item.image_url[0]}
                           alt={item.name}
                           fill
                           className="object-cover"
                        />
                        {/* Title absolute di atas image */}
                        <div className="absolute top-0 left-0 w-full bg-black/60 text-white text-sm font-semibold px-2 py-1 text-center truncate z-10">
                           {item.name}
                        </div>
                     </div>
                     {/* Description */}
                     <div className="text-xs text-gray-600  line-clamp-2 text-center">
                        {item.description}
                     </div>
                     {/* Stok */}
                     <div className="text-xs text-gray-500 text-center">
                        Stok: <span className="font-medium">{item.stok}</span>
                     </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 px-4 pb-0 mt-auto">
                     <div className="text-primary font-semibold text-base mb-2">
                        {formatRupiah(item.price)}
                     </div>
                     <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleAddToCart(item)}
                     >
                        Tambah
                     </Button>
                  </CardFooter>
               </Card>
            </motion.div>
         ))}
      </div>
   )
}
