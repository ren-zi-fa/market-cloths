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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { productSchema } from '@/schema'
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select'
import { useProductStore } from '@/hooks/product-store'

type ProductSchema = z.infer<typeof productSchema>

type FormEditProduct = {
   id: string
}

export default function FormEditProduct({ id }: FormEditProduct) {
   const [loading, setLoading] = useState(false)
   const [open, setOpen] = useState(false)
   const form = useForm<ProductSchema>({
      resolver: zodResolver(productSchema),
      defaultValues: {
         name: '',
         description: '',
         category_name: '',
         image_url: [],
         price: 0,
         stok: 0
      }
   })
   const { fetchData: fetchCategory } = useProductStore()
   const {  data: category } = useCategoryStore()
   // Ambil data kategori setiap kali dialog dibuka
   useEffect(() => {
      if (!open) return
      instance
         .get(`/api/products/${id}`)
         .then((res) => {
            const data = res.data.data
            form.reset({
               name: data.name ?? '',
               description: data.description ?? '',
               category_name: data.category_name ?? '',
               image_url:
                  data.image_url && data.image_url.length > 0
                     ? data.image_url
                     : [''],
               price: data.price ?? 0,
               stok: data.stok ?? 0
            })
         })
         .catch(() => {
            toast.error('Gagal mengambil data produk')
         })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id, open])

   const onUpdate = async (values: ProductSchema) => {
      setLoading(true)
      try {
         const res = await instance.put(`/api/products/${id}`, values)
         if (res.status === 201 || res.status === 200) {
            toast.success('Product berhasil diupdate!')
            setOpen(false)
            fetchCategory()
         } else {
            toast.error('Gagal mengupdate product.')
         }
      } catch (error) {
         if (axios.isAxiosError(error)) {
            // Jika error validasi dari backend berupa objek { field: message }
            const errors = error.response?.data?.errors
            if (errors && typeof errors === 'object') {
               Object.entries(errors).forEach(([field, message]) => {
                  form.setError(field as keyof ProductSchema, {
                     type: 'server',
                     message: String(message)
                  })
               })
            }
            const msg =
               error.response?.data?.message || error.message || 'Unknown error'
            toast.error('Gagal mengupdate product: ' + msg)
         } else {
            toast.error('Gagal mengupdate product: Unknown error')
         }
      } finally {
         setLoading(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline">Edit Produk</Button>
         </DialogTrigger>
         <DialogContent className="overflow-auto max-h-[80vh]">
            <DialogHeader>
               <DialogTitle>Edit Produk Baru</DialogTitle>
               <DialogDescription>
                  Isi data produk di bawah ini.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onUpdate)}
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
                  <FormField
                     control={form.control}
                     name="category_name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Category</FormLabel>
                           <FormControl>
                              <Select
                                 value={field.value}
                                 onValueChange={field.onChange}
                                 disabled={loading}
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih kategori" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {category?.map((cat: { name: string }) => (
                                       <SelectItem
                                          key={cat.name}
                                          value={cat.name}
                                       >
                                          {cat.name}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
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
                              <Textarea
                                 placeholder="Deskripsi produk"
                                 {...field}
                              />
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
                           <FormLabel>Edit URL Gambar Produk</FormLabel>
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
                           {form.formState.errors.image_url?.message && (
                              <FormMessage>
                                 {form.formState.errors.image_url.message}
                              </FormMessage>
                           )}

                           {form.formState.errors.image_url &&
                              Array.isArray(form.formState.errors.image_url) &&
                              form.formState.errors.image_url.map((err, idx) =>
                                 err && 'message' in err ? (
                                    <p
                                       key={idx}
                                       className="text-sm text-red-500"
                                    >
                                       Gambar #{idx + 1}: {err.message}
                                    </p>
                                 ) : null
                              )}
                        </FormItem>
                     )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? 'Menyimpan...' : 'Simpan Produk'}
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
