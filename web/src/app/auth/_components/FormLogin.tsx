'use client'

import { useEffect, useState } from 'react'
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
import instance from '@/lib/axios'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type LoginInput = z.infer<typeof LoginSchema>

export default function FormLogin() {
   const [showPassword, setShowPassword] = useState(false)
   const router = useRouter()
   const form = useForm<LoginInput>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
         login_name: '',
         password: ''
      }
   })
   const { setError } = form
   const [loginError, setLoginError] = useState<string | null>('')
   const onLogin = async (data: LoginInput) => {
      try {
         await instance.post('/api/auth/login', data)

         router.replace('/')
      } catch (err) {
         if (axios.isAxiosError(err)) {
            const messages = err.response?.data?.message
            setLoginError(messages)
            if (Array.isArray(messages)) {
               messages.forEach((msg) => {
                  if (msg.type === 'field' && msg.path && msg.msg) {
                     setError(msg.path, { message: msg.msg })
                  }
               })
            }
         }
         // Tidak ada redirect di sini, user tetap di halaman login
      }
   }

   useEffect(() => {
      if (loginError) {
         toast.error(loginError)
      }
   }, [loginError])

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onLogin)}
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
