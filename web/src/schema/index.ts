import { z } from 'zod'

export const productSchema = z.object({
   id: z.string().optional(),
   name: z.string({ message: 'Nama produk wajib diisi' }),
   price: z.number({ message: 'Harga produk wajib berupa angka' }),
   stok: z.number({ message: 'Stok produk wajib berupa angka' }),
   description: z.string({ message: 'Deskripsi produk wajib diisi' }),
   image_url: z.array(z.string().url({ message: 'URL gambar tidak valid' }), {
      message: 'Gambar produk wajib diisi'
   }),
   category_name: z.string()
})

export const category_schema = z.object({
   id: z.string().optional(),
   name: z.string({ message: 'nama category wajib di isi' }),
   description: z.string({ message: 'deskripsi wajib di isi' })
})

export const RegisterSchema = z
   .object({
      username: z.string().min(3, 'Username minimal 3 karakter'),
      email: z.string().email('Format email tidak valid'),
      password: z
         .string()
         .min(6, 'Password minimal 6 karakter')
         .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
         .regex(/[0-9]/, 'Password harus mengandung angka'),
      konfirmasi_password: z.string(),
      makanan_favorite: z.string().min(3, 'Username minimal 3 karakter')
   })

   .refine((data) => data.password === data.konfirmasi_password, {
      path: ['konfirmasi_password'],
      message: ' password tidak sama dengan sebelumnya'
   })

export const LoginSchema = z.object({
   login_name: z.string().nonempty('username atau email wajib di isi'),
   password: z.string().nonempty('password wajib di isi')
})
