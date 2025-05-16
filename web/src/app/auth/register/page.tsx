import FormRegister from '../_components/FormRegister'

export default function page() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="container max-w-sm md:max-w-lg space-y-5 mx-auto bg-gray-300 p-8 rounded-3xl">
            <h1 className="text-3xl text-center">Register</h1>
            <FormRegister />
         </div>
      </div>
   )
}
