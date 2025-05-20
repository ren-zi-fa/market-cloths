import { create } from 'zustand'
import instance from '@/lib/axios'
import { Category } from '@/types'
import { useEffect, useState } from 'react'

interface CategoryState {
   data: Category[]
   fetchData: () => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
   data: [],
   fetchData: async () => {
      try {
         const res = await instance.get('/api/categories')
         set({ data: res.data.data })
      } catch (e) {
         console.log(e)
      }
   }
}))

export function useCategoryById(id: string | undefined) {
   const [category, setCategory] = useState<Category | null>(null)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      if (!id) return
      setLoading(true)
      setError(null)
      instance
         .get(`/api/categories/${id}`)
         .then((res) => setCategory(res.data.data))
         .catch((err) => setError('Gagal mengambil kategori'))
         .finally(() => setLoading(false))
   }, [id])

   return { category, loading, error }
}
