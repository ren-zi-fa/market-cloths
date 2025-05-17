'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Iproduct } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'

type CarouselProps = Iproduct

export default function Carousel({ data }: { data: CarouselProps[] }) {
   const [index, setIndex] = useState(0)

   const prev = () => setIndex((index - 1 + data.length) % data.length)
   const next = () => setIndex((index + 1) % data.length)
   const getItem = (i: number) => data[(i + data.length) % data.length]

   return (
      <div className="h-screen">
         <div className="relative w-full max-w-4xl mx-auto h-full -400 flex items-center justify-center overflow-hidden">
            <AnimatePresence initial={false}>
               {[index - 1, index, index + 1].map((i, idx) => {
                  const item = getItem(i)
                  const position = i - index

                  let scale = position === 0 ? 1 : 0.8
                  let zIndex = position === 0 ? 10 : 1
                  let opacity = position === 0 ? 1 : 0.5
                  let x = position * 250

                  return (
                     <motion.div
                        key={i}
                        className="absolute"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity, scale, x, zIndex }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.5 }}
                     >
                        <Card className="w-60 h-80 flex flex-col items-center overflow-hidden">
                           <Image
                              src={item.image_url[0]}
                              alt={item.name}
                              width={200}
                              height={300}
                              className="w-full h-40 object-contain p-2"
                           />
                           <CardContent className="text-center space-y-1">
                              <h2 className="font-bold text-lg">{item.name}</h2>
                              <p className="text-gray-600">
                                 Rp {item.price.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-400">
                                 Stok: {item.stok}
                              </p>
                           </CardContent>
                        </Card>
                     </motion.div>
                  )
               })}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute left-0 px-4">
               <button
                  onClick={prev}
                  className="bg-white/70 p-2 rounded-full shadow"
               >
                  <ArrowLeft />
               </button>
            </div>
            <div className="absolute right-0 px-4">
               <button
                  onClick={next}
                  className="bg-white/70 p-2 rounded-full shadow"
               >
                  <ArrowRight />
               </button>
            </div>
         </div>
      </div>
   )
}
