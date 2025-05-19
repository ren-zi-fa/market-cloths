import { Metadata } from 'next'
import CategoryTable from '../_components/CategoryTable'

export const metadata: Metadata = {
   title: 'Manage Category',
   description: 'Manage Category page'
}
export default function page() {
   return (
      <div className="container max-w-6xl mx-auto space-y-5">
         <h1 className='text-center text-xl font-bold '>Categories Managament</h1>
         <CategoryTable />
      </div>
   )
}
