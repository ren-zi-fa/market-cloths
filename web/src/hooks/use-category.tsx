'use client'

import {
   createContext,
   useContext,
   useEffect,
   useState,
   ReactNode,
   useMemo
} from 'react'
import { Category } from '@/types'
import instance from '@/lib/axios'

type CategoryItem = Category

interface CatergoryContextType {
   category: CategoryItem[]
}

const CategoryContext = createContext<CatergoryContextType | undefined>(
   undefined
)

export const CategoryProvider = async ({
   children
}: {
   children: ReactNode
}) => {
   const [category, setCategory] = useState<CategoryItem[]>([])
   const categoryRes = await instance.get('/api/categories')
   setCategory(categoryRes.data)
   useEffect(() => {}, [])

   const value = useMemo(
      () => ({
         category
      }),
      [category]
   )
   return (
      <CategoryContext.Provider value={value}>
         {children}
      </CategoryContext.Provider>
   )
}

export const useCart = () => {
   const context = useContext(CategoryContext)
   if (!context) {
      throw new Error('useCart harus digunakan di dalam CartProvider')
   }
   return context
}
