import { Metadata } from 'next'
import DataProduct from '../_components/Product/DataProduct'

export const metadata: Metadata = {
   title: 'Manage Products',
   description: 'Manage Products page'
}
export default function page() {
   return (
      <div className="container max-w-6xl mx-auto space-y-5">
         <h1 className="text-center text-xl font-bold ">
            Products Managament
         </h1>
         <DataProduct />
      </div>
   )
}
