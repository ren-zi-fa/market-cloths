import { create } from 'zustand'
import instance from '@/lib/axios'
import { Category } from '@/types'

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
   },
}))