'use client'

import { Iproduct } from '@/types'
import CarouselProductNew from './carouselNew'
import { useIsMobile } from '@/hooks/use-mobile'
import CardNew from './cardNew'

export default function HomeView({ newProduct }: { newProduct: Iproduct[] }) {
   const isMobile = useIsMobile()

   return (
      <div className="">
         <div className="container px-6 flex justify-center">
            {isMobile ? (
               <CardNew data={newProduct} />
            ) : (
               <CarouselProductNew data={newProduct} />
            )}
         </div>
      </div>
   )
}
