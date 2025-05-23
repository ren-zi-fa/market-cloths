'use client'

import React, { useEffect, useState, useMemo } from 'react'
import AsyncSelect from 'react-select/async'
import debounce from 'lodash.debounce'
import instance from '@/lib/axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Product = {
   id: string
   name: string
   category_name: string
   image_url: string[]
}

type OptionType = {
   label: string
   value: string
   image: string
}

const fetchOptions = async (inputValue: string): Promise<OptionType[]> => {
   try {
      const res = await instance.get('/api/products', {
         params: { search: inputValue }
      })

      const products: Product[] = res.data.data

      return products.map((product) => ({
         label: `${product.category_name} - ${product.name}`,
         value: product.id,
         image: product.image_url?.[0] || ''
      }))
   } catch (err) {
      console.error('Fetch error:', err)
      return []
   }
}

export default function SearchInput() {
   const [defaultOptions, setDefaultOptions] = useState<OptionType[]>([])
   const [hasMounted, setHasMounted] = useState(false)
   const [selected, setSelected] = useState<OptionType | null>(null)
   const router = useRouter()

   useEffect(() => {
      setHasMounted(true)
      fetchOptions('').then(setDefaultOptions)
   }, [])

   const loadOptions = useMemo(
      () =>
         debounce(
            (inputValue: string, callback: (options: OptionType[]) => void) => {
               fetchOptions(inputValue).then(callback)
            },
            500
         ),
      []
   )

   useEffect(() => {
      return () => {
         loadOptions.cancel()
      }
   }, [loadOptions])
   useEffect(() => {
      if (selected) {
         router.push(`/detail/${selected.value}`)
      }
   }, [selected, router])

   if (!hasMounted) return null

   return (
      <div className="container max-w-md space-y-2">
         <div className="flex-col flex ms-4">
            <Link href={`/category/casual`} className='hover:underline'>CASUAL</Link>
            <Link href={`/category/formal`}  className='hover:underline'>FORMAL</Link>
         </div>

         <div className="relative">
            <AsyncSelect
               cacheOptions
               loadOptions={loadOptions}
               defaultOptions={defaultOptions}
               placeholder="Cari produk..."
               onChange={(option) => setSelected(option as OptionType)}
               formatOptionLabel={(e: OptionType) => (
                  <div className="flex items-center gap-2">
                     {e.image && (
                        <Image
                           src={e.image}
                           alt={e.label}
                           width={24}
                           height={24}
                           className="object-cover rounded-sm"
                        />
                     )}
                     <span>{e.label}</span>
                  </div>
               )}
               noOptionsMessage={() => 'Not found'}
            />
         </div>
      </div>
   )
}
