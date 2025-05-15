'use client'

import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
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

type ProductFormValues = z.infer<typeof productSchema>

export default function FormProduct() {
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

   const onSubmit = (values: ProductFormValues) => {
      // Handle submit (API call, etc)
      console.log(values)
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

            <Button type="submit" className="w-full">
               Simpan Produk
            </Button>
         </form>
      </Form>
   )
}
