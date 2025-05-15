"use client"
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'

export default function SearchInput() {
   const [value, setValue] = useState('')

   return (
      <div className="container max-w-md space-y-2">
         <h1>MEN</h1>
         <h1>WOMEN</h1>
         <h1>KIDS</h1>
         <div className="relative">
            <Input
               value={value}
               onChange={e => setValue(e.target.value)}
               placeholder="Search"
               className="pl-10"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
               <Search />
            </div>
         </div>
      </div>
   )
}
