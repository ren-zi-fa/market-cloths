import { create } from 'zustand'
import instance from '@/lib/axios'
import { Iproduct } from '@/types'
import { useEffect, useState } from 'react'

interface ProductState {
   data: Iproduct[]
   fetchData: (limit?: number) => Promise<void>
   pagination?: {
      page: number
      limit: number
      totalItems: number
      totalPages: number
   } | null
}

export const useProductStore = create<ProductState>((set) => ({
   data: [],
   pagination: null,
   fetchData: async (limit?: number) => {
      try {
         const res = await instance.get(`/api/products?limit=${limit}`)
         set({ data: res.data.data },)
         set({pagination:res.data.pagination})
      } catch (e) {
         console.log(e)
      }
   }
}))

export function useProductById(id: string | undefined) {
   const [product, setProduct] = useState<Iproduct | null>(null)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      if (!id) return
      setLoading(true)
      setError(null)
      instance
         .get(`/api/products/${id}`)
         .then((res) => setProduct(res.data.data))
         .catch((err) => setError(`Gagal mengambil product ${err}`))
         .finally(() => setLoading(false))
   }, [id])

   return { product, loading, error }
}
