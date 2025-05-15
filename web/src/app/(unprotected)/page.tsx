import SearchInput from '@/components/Home/SearchInput'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
export const metadata: Metadata = {
   title: 'Home',
   description: 'Home page'
}
export default function Home() {
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
            <div className="flex flex-col md:flex-row order-1 md:order-2 gap-4 justify-center items-center">
               <div className="w-[300px] md:w-full flex justify-center">
                  <Image
                     src="/images/sect1.png"
                     alt="gambar1"
                     width={600}
                     height={300}
                     className="rounded-lg object-cover w-full h-auto"
                     priority
                  />
               </div>
               <div className="w-[300px] md:w-full flex justify-center">
                  <Image
                     src="/images/sect2.png"
                     alt="gambar2"
                     width={600}
                     height={300}
                     className="rounded-lg object-cover w-full h-auto"
                     priority
                  />
               </div>
            </div>
         </div>
      </div>
   )
}
