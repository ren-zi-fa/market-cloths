import { cookies } from 'next/headers'
import FormLogin from '../_components/FormLogin'
import { redirect } from 'next/navigation'

export default async function page() {
   const session = (await cookies()).get('refresh_token')?.value
   if (session) {
      redirect('/')
   }
   console.log('session', session)
   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="container max-w-sm md:max-w-lg space-y-5 mx-auto bg-gray-300 p-8 rounded-3xl">
            <h1 className="text-3xl text-center">LOGIN</h1>
            <FormLogin />
         </div>
      </div>
   )
}
