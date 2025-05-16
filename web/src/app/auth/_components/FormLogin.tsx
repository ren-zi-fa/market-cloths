'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schema'
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

type LoginInput = z.infer<typeof LoginSchema>

export default function FormLogin() {
   const [showPassword, setShowPassword] = useState(false)

   const form = useForm<LoginInput>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
         login_name: '',
         password: ''
      }
   })

   const onSubmit = (data: LoginInput) => {
      // Lakukan proses login di sini
      console.log(data)
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto"
         >
            <FormField
               control={form.control}
               name="login_name"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Username atau Email</FormLabel>
                     <Input
                        placeholder="Masukkan username atau email"
                        {...field}
                     />
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
            <Button type="submit" className="w-full">
               Login
            </Button>
            <div className="text-center text-sm mt-2">
               Belum punya akun?{' '}
               <Link
                  href="/auth/register"
                  className="text-blue-600 hover:underline"
               >
                  Register di sini
               </Link>
            </div>
         </form>
      </Form>
   )
}
