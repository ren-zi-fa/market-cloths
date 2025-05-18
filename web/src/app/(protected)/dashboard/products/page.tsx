import { Metadata } from 'next'
import FormProduct from '../_components/FormProduct'

export const metadata: Metadata = {
   title: 'Manage Products',
   description: 'Manage Products page'
}
export default function page() {
   return (
      <div className="mt-10 space-y-5">
         <h1 className='text-center font-bold text-3xl'>Create Product</h1>
         <FormProduct />
      </div>
   )
}
