'use client'

import SearchInput from '@/components/Home/SearchInput'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import SectionBottom from './_components/section-bottom'
import HomeView from './_components'
import { useEffect, useState } from 'react'
import { Iproduct } from '@/types'
import instance from '@/lib/axios'

export default function Home() {
   const [newProduct, setProduct] = useState<Iproduct[] | null>(null)
   useEffect(() => {
      instance
         .get('/api/products?limit=10')
         .then((res) => setProduct(res.data.data))
         .catch((e) => console.log(e))
   }, [])

   return (
      <div className="flex flex-col gap-6 mt-10 px-4">
         <SearchInput />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 container mx-auto items-center">
            {/* Text Section */}
            <div className="flex flex-col order-2 md:order-1 space-y-4">
               <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  New <br /> Collections
               </h1>
               <p className="text-lg md:text-2xl text-gray-600">
                  summer <br />
                  2024
               </p>
               <Button className="flex w-max items-center gap-2">
                  Go to Shop <ArrowRight />
               </Button>
            </div>
            {/* Images Section */}
            <div className="flex flex-col md:flex-row order-1 md:order-2 gap-4 justify-center items-center z-0">
               <div className="w-[300px] md:w-full flex justify-center">
                  <Image
                     src="/images/head1.png"
                     alt="gambar1"
                     width={600}
                     height={300}
                     className="rounded-lg object-cover w-full h-auto"
                     priority
                  />
               </div>
               <div className="w-[300px] md:w-full flex justify-center">
                  <Image
                     src="/images/head2.png"
                     alt="gambar2"
                     width={600}
                     height={300}
                     className="rounded-lg object-cover w-full h-auto"
                     priority
                  />
               </div>
            </div>
         </div>
         <div className="h-full flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
               New <br />
               This Week
            </h1>
            {newProduct && <HomeView newProduct={newProduct} />}
         </div>
         <div className="text-center space-y-2">
            <h1 className="md:text-5xl tracking-widest text-3xl">
               Our Approach to fashion design
            </h1>
            <p className="mb-4">
               at elegant vogue , we blend creativity with craftsmanship to
               create <br /> fashion that transcends trends and stands the test
               of time each <br /> design is meticulously crafted, ensuring the
               highest quelity exqulsite finish
            </p>
            <SectionBottom />
         </div>
      </div>
   )
}
