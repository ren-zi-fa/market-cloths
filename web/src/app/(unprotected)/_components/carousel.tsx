'use client'

import * as React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious
} from '@/components/ui/carousel'
import { Iproduct } from '@/types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useProfile } from '@/hooks/use-profile'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'

type CarouselProps = Iproduct

export default function CarouselProduct({ data }: { data: CarouselProps[] }) {
   const { user } = useProfile()
   const router = useRouter()
   const { addToCart } = useCart()

   const handleAddToCart = (item: CarouselProps) => {
      if (!user) {
         return router.push('/auth/login')
      }
      addToCart(item)
   }

   return (
      <div className="w-full px-4 py-6">
         <Carousel
            opts={{ align: 'start' }}
            className="w-full md:max-w-6xl mx-auto"
         >
            <CarouselContent>
               {data.map((item, index) => (
                  <CarouselItem
                     key={index}
                     className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                     <div className="p-2">
                        <Card className="transition hover:shadow-lg flex flex-col justify-between h-full">
                           <CardContent className="relative aspect-[4/5] px-4 md:p-2">
                              <div className="relative w-full h-full">
                                 <Image
                                    src={item.image_url[0]}
                                    alt={item.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover rounded-md"
                                 />
                                 <p className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold bg-black/5 backdrop-blur-sm rounded-md text-center px-2">
                                    {item.name}
                                 </p>
                              </div>
                           </CardContent>
                           <CardFooter className="flex flex-col items-start justify-between px-4 py-2 gap-2 text-sm">
                              <div className="w-full flex justify-between text-muted-foreground">
                                 <span className="font-semibold">
                                    {item.price} $
                                 </span>
                                 <span>Stok: {item.stok}</span>
                              </div>
                              <Button
                                 size="sm"
                                 className="w-full mt-1"
                                 onClick={() => handleAddToCart(item)}
                              >
                                 <Plus className="mr-2 h-4 w-4" /> Add
                              </Button>
                           </CardFooter>
                        </Card>
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
         </Carousel>
      </div>
   )
}
