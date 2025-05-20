'use client'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogTrigger,
   DialogTitle
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { category_schema } from '@/schema'
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

type CategorySchema = z.infer<typeof category_schema>

type FormEditCategoryProps = {
   id: string
}

export default function FormEditCategory({ id }: FormEditCategoryProps) {
   const fetchData = useCategoryStore((state) => state.fetchData)

   const [loading, setLoading] = useState(false)
   const [open, setOpen] = useState(false)
   const form = useForm<CategorySchema>({
      resolver: zodResolver(category_schema),
      defaultValues: {
         name: '',
         description: ''
      }
   })

   // Ambil data kategori setiap kali dialog dibuka
   useEffect(() => {
      if (!open) return
      instance
         .get(`/api/categories/${id}`)
         .then((res) => {
            const { name, description } = res.data.data
            form.reset({ name, description: description ?? '' })
         })
         .catch(() => {
            toast.error('Gagal mengambil data kategori')
         })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id, open])

   const onUpdate = async (values: CategorySchema) => {
      setLoading(true)
      try {
         const res = await instance.put(`/api/categories/${id}`, values)
         if (res.status === 201 || res.status === 200) {
            toast.success('Kategori berhasil diupdate!')
            setOpen(false) // Tutup dialog setelah sukses

            fetchData()
         } else {
            toast.error('Gagal mengupdate kategori.')
         }
      } catch (error) {
         const msg = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : 'Unknown error'
         toast.error('Gagal mengupdate kategori: ' + msg)
      } finally {
         setLoading(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button size="lg" className="flex items-center gap-2">
               Edit Kategori
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px] rounded-xl p-6">
            <DialogTitle className="text-2xl font-semibold mb-4">
               Edit Kategori
            </DialogTitle>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onUpdate)}
                  className="space-y-5"
               >
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-base font-medium">
                              Nama Kategori
                           </FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Masukkan nama kategori"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-base font-medium">
                              Deskripsi
                           </FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Masukkan deskripsi kategori (opsional)"
                                 className="min-h-[100px]"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button
                     type="submit"
                     className="w-full text-base py-2"
                     disabled={loading}
                  >
                     {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
