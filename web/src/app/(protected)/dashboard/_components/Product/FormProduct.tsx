'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { productSchema } from '@/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormControl
} from '@/components/ui/form'
import { toast } from 'sonner'
import instance from '@/lib/axios'
import axios from 'axios'
import { useCategoryStore } from '@/hooks/category-store'

type ProductFormValues = z.infer<typeof productSchema>

export default function FormProduct() {
   const [loading, setLoading] = useState(false)
   const { data: category } = useCategoryStore()
   console.log(category)
   const form = useForm<ProductFormValues>({
      resolver: zodResolver(productSchema),
      defaultValues: {
         name: '',
         price: 0,
         stok: 0,
         description: '',
         image_url: ['']
      }
   })

   const onSubmit = async (values: ProductFormValues) => {
      setLoading(true)
      try {
         const res = await instance.post('/api/products', values)
         if (res.status === 201 || res.status === 200) {
            form.reset()
            toast.success('Produk berhasil disimpan!')
         } else {
            toast.error(
               'Gagal menyimpan produk: ' +
                  (res.data?.message || 'Unknown error')
            )
         }
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const msg =
               error.response?.data?.message || error.message || 'Unknown error'
            toast.error('Gagal menyimpan produk: ' + msg)
         } else {
            toast.error('Gagal menyimpan produk: Unknown error')
         }
      } finally {
         setLoading(false)
      }
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow"
         >
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Nama Produk</FormLabel>
                     <FormControl>
                        <Input placeholder="Nama produk" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex gap-4">
               <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                     <FormItem className="flex-1">
                        <FormLabel>Harga</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              min={0}
                              placeholder="Harga produk"
                              {...field}
                              onChange={(e) =>
                                 field.onChange(Number(e.target.value))
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="stok"
                  render={({ field }) => (
                     <FormItem className="flex-1">
                        <FormLabel>Stok</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              min={0}
                              placeholder="Stok produk"
                              {...field}
                              onChange={(e) =>
                                 field.onChange(Number(e.target.value))
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Deskripsi</FormLabel>
                     <FormControl>
                        <Textarea placeholder="Deskripsi produk" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="image_url"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>URL Gambar Produk</FormLabel>
                     <FormControl>
                        <div className="space-y-2">
                           {field.value.map((url, idx) => (
                              <div
                                 key={idx}
                                 className="flex gap-2 items-center"
                              >
                                 <Input
                                    placeholder={`URL gambar #${idx + 1}`}
                                    value={url}
                                    onChange={(e) => {
                                       const newArr = [...field.value]
                                       newArr[idx] = e.target.value
                                       field.onChange(newArr)
                                    }}
                                 />
                                 <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                       const newArr = field.value.filter(
                                          (_, i) => i !== idx
                                       )
                                       field.onChange(
                                          newArr.length ? newArr : ['']
                                       )
                                    }}
                                    disabled={field.value.length === 1}
                                    title="Hapus gambar"
                                 >
                                    &times;
                                 </Button>
                              </div>
                           ))}
                           <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                 field.onChange([...field.value, ''])
                              }
                           >
                              Tambah URL Gambar
                           </Button>
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
               {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </Button>
         </form>
      </Form>
   )
}
