import DataCategory from '../_components/Category/DataCategory'

export default async function Page() {
   // SSR fetch data
 
   return (
      <div className="container max-w-6xl mx-auto space-y-5">
         <h1 className="text-center text-xl font-bold ">
            Categories Managament
         </h1>
         <DataCategory  />
      </div>
   )
}
