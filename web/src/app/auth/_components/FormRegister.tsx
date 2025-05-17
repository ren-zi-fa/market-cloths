'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema } from '@/schema'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import instance from '@/lib/axios'
import { toast } from 'sonner'

type RegisterInput = z.infer<typeof RegisterSchema>

export default function FormRegister() {
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   const form = useForm<RegisterInput>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
         username: '',
         email: '',
         password: '',
         konfirmasi_password: '',
         makanan_favorite: ''
      }
   })

   const onRegister = async (data: RegisterInput) => {
      try {
         const result = await instance.post('/api/auth/register', data)
         toast.success(result.data.message || 'Registrasi berhasil!')
         // Optional: reset form jika ingin
         // form.reset()
      } catch (error: any) {
         const msg =
            error?.response?.data?.message ||
            'Terjadi kesalahan saat registrasi'
         // Jika message berupa array (dari express-validator)
         if (Array.isArray(msg)) {
            msg.forEach((m: any) => toast.error(m.msg || m.message || 'Error'))
         } else {
            toast.error(msg)
         }
      }
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onRegister)}
            className="space-y-4 max-w-sm mx-auto"
         >
            <FormField
               control={form.control}
               name="username"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Username</FormLabel>
                     <Input placeholder="Masukkan username" {...field} />
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <Input
                        type="email"
                        placeholder="Masukkan email"
                        {...field}
                     />
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="makanan_favorite"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Makanan Favorite</FormLabel>
                     <Input type="text" placeholder="Mie Ayam" {...field} />
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Password</FormLabel>
                     <div className="relative">
                        <Input
                           type={showPassword ? 'text' : 'password'}
                           placeholder="Masukkan password"
                           {...field}
                        />
                        <button
                           type="button"
                           tabIndex={-1}
                           className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                           onClick={() => setShowPassword((prev) => !prev)}
                        >
                           {showPassword ? (
                              <EyeOff size={20} />
                           ) : (
                              <Eye size={20} />
                           )}
                        </button>
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="konfirmasi_password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Konfirmasi Password</FormLabel>
                     <div className="relative">
                        <Input
                           type={showConfirmPassword ? 'text' : 'password'}
                           placeholder="Ulangi password"
                           {...field}
                        />
                        <button
                           type="button"
                           tabIndex={-1}
                           className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                           onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                           }
                        >
                           {showConfirmPassword ? (
                              <EyeOff size={20} />
                           ) : (
                              <Eye size={20} />
                           )}
                        </button>
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" className="w-full">
               Register
            </Button>
            <div className="text-center text-sm mt-2">
               Sudah punya akun?{' '}
               <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline"
               >
                  Login di sini
               </Link>
            </div>
         </form>
      </Form>
   )
}
