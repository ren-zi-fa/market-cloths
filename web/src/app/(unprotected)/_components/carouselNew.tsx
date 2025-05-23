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
import { useCart } from '@/hooks/use-cart'
import { formatRupiah } from '@/lib/formatRupiah'
import { useRouter } from 'next/navigation'

export default function CarouselProductNew({ data }: { data: Iproduct[] }) {
   const { addToCart } = useCart()
   const handleCart = (
      item: Iproduct,
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      e.preventDefault()
      addToCart(item)
   }
   const router = useRouter()
   return (
      <div className="w-full px-4 py-6 mx-auto">
         <Carousel
            opts={{ align: 'start' }}
            className="w-full md:max-w-6xl mx-auto"
         >
            <CarouselContent>
               {data.map((item, index) => (
                  <CarouselItem
                     key={index}
                     className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                     <div className="p-2 h-full">
                        <Card className="transition hover:shadow-lg flex flex-col justify-between h-full">
                           <button
                              onClick={() => router.push(`/detail/${item.id}`)}
                           >
                              <CardContent className="relative aspect-[4/5] py-2 px-4">
                                 <div className="relative w-full h-full">
                                    <Image
                                       src={item.image_url[0]}
                                       alt={item.name}
                                       width={300}
                                       height={300}
                                       className="w-full h-full object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black/10 rounded-md flex items-center justify-center px-2 text-center">
                                       <p className="text-white text-base font-semibold drop-shadow">
                                          {item.name}
                                       </p>
                                    </div>
                                 </div>
                              </CardContent>
                           </button>

                           <div className="px-4 pt-1 pb-0 text-sm text-gray-600 line-clamp-2">
                              {item.description}
                           </div>

                           <CardFooter className="flex flex-col w-full md:items-center items-stretch justify-between px-4 py-2 gap-2 text-sm mt-auto">
                              <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto gap-1 md:gap-4 text-muted-foreground">
                                 <span className="font-semibold">
                                    {formatRupiah(item.price)}
                                 </span>
                                 <span className="text-xs md:text-sm">
                                    Stok: {item.stok}
                                 </span>
                              </div>
                              <Button
                                 size="sm"
                                 className="w-full  mt-1 md:mt-0"
                                 onClick={(e) => handleCart(item, e)}
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
