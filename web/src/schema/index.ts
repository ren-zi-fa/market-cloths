import { z } from 'zod'

export const productSchema = z.object({
   id: z.string().optional(),
   name: z.string({ message: "Nama produk wajib diisi" }),
   price: z.number({ message: "Harga produk wajib berupa angka" }),
   stok: z.number({ message: "Stok produk wajib berupa angka" }),
   description: z.string({ message: "Deskripsi produk wajib diisi" }),
   image_url: z.array(z.string().url({ message: "URL gambar tidak valid" }), { message: "Gambar produk wajib diisi" })
})
