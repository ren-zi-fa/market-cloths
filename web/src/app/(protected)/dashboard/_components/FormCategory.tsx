import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogTrigger,
   DialogTitle
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
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

type FormCategoryProps = {
   onSuccess?: () => void
}

export default function FormCategory({ onSuccess }: FormCategoryProps) {
   const [loading, setLoading] = useState(false)

   const form = useForm<CategorySchema>({
      resolver: zodResolver(category_schema),
      defaultValues: {
         name: '',
         description: ''
      }
   })

   const onSubmit = async (values: CategorySchema) => {
      setLoading(true)
      try {
         const res = await instance.post('/api/categories', values)
         if (res.status === 201 || res.status === 200) {
            form.reset()
            toast.success('Kategori berhasil disimpan!')
            if (onSuccess) onSuccess() // Panggil fetch dari parent
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
            <Button size="lg" className="flex items-center gap-2">
               <Plus size={20} />
               Tambah Kategori
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px] rounded-xl p-6">
            <DialogTitle className="text-2xl font-semibold mb-4">
               Tambah Kategori Baru
            </DialogTitle>
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
