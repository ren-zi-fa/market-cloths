import CategoryTable from '../_components/CategoryTable'
import BillboardClient from '../_components/test/TableTest'

export default function page() {
   return (
      <div className="container max-w-6xl mx-auto space-y-5">
         <h1 className="text-center text-xl font-bold ">
            Categories Managament
         </h1>
         <BillboardClient />
      </div>
   )
}
