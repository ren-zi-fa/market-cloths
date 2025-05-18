'use client'

import Image from 'next/image'

export default function SectionBottom() {
   const images = [
      '/images/head1.png',
      '/images/head2.png',
      '/images/head3.png',
      '/images/head4.png'
   ]

   return (
      <div className="relative z-0 py-20 px-10 overflow-hidden ">
         <div className="flex gap-10 justify-center z-0">
            {images.map((src, index) => (
               <div
                  key={index}
                  className={`relative transition-transform hover:scale-105`}
                  style={{
                     marginTop: index % 2 === 0 ? '-40px' : '40px'
                  }}
               >
                  <div className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] h-auto z-0">
                     <Image
                        src={src}
                        alt={`Image ${index + 1}`}
                        width={500} 
                        height={700}
                        className="w-full z-0 h-auto object-cover rounded-md shadow-lg"
                     />
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
