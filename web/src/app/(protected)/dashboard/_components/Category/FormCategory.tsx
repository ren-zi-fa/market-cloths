'use client'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogTrigger,
   DialogTitle,
   DialogHeader,
   DialogDescription
} from '@/components/ui/dialog'
import { useState } from 'react'
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

type CategorySchema = z.infer<typeof category_schema>

interface FormProps {
   onSucces: () => void
}
export default function FormCategory({ onSucces }: FormProps) {
   const [loading, setLoading] = useState(false)

   const form = useForm<CategorySchema>({
      resolver: zodResolver(category_schema),
      defaultValues: {
         name: '',
         description: ''
      }
   })
   console.log(form.formState.errors)

   const onSubmit = async (values: CategorySchema) => {
      setLoading(true)
      try {
         const res = await instance.post('/api/categories', values)
         if (res.status === 201 || res.status === 200) {
            form.reset()
            toast.success('Kategori berhasil disimpan!')
            onSucces()
         } else {
            toast.error('Gagal menyimpan kategori.')
         }
      } catch (error) {
         const msg = axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : 'Unknown error'
         toast.error('Gagal menyimpan kategori: ' + msg)
      } finally {
         setLoading(false)
      }
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant="outline">Tambah Category</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px] rounded-xl p-6">
            <DialogHeader>
               <DialogTitle>Tambah kategori Baru</DialogTitle>
               <DialogDescription>
                  Isi data kategori di bawah ini.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
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
                     {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
