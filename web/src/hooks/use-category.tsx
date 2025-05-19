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

interface CategoryContextType {
   category: CategoryItem[]
   setCategory: React.Dispatch<React.SetStateAction<CategoryItem[]>>
}

const CategoryContext = createContext<CategoryContextType | undefined>(
   undefined
)

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
   const [category, setCategory] = useState<CategoryItem[]>([])

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await instance.get('/api/categories')
            setCategory(response.data.data)
         } catch (error) {
            console.error('Gagal mengambil kategori:', error)
         }
      }

      fetchCategories()
   }, [])

   const value = useMemo(() => ({ category, setCategory }), [category])

   return (
      <CategoryContext.Provider value={value}>
         {children}
      </CategoryContext.Provider>
   )
}

export const useCategory = () => {
   const context = useContext(CategoryContext)
   if (!context) {
      throw new Error('useCategory harus digunakan di dalam CategoryProvider')
   }
   return context
}
