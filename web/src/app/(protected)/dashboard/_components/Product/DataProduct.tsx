'use client'

import { DataTable } from '@/components/datatable'

import React, { useEffect, useState } from 'react'

import FormProduct from './FormProduct'
import { columnProduct } from './column-product'
import { useProductStore } from '@/hooks/product-store'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select'


export default function DataProduct() {
   const { data, fetchData, pagination } = useProductStore()
   const [limit, setLimit] = useState<number>(10)

   useEffect(() => {
      fetchData(limit)
   }, [fetchData, limit])

   return (
      <>
         {/* Select Limit */}

         <FormProduct onSucces={fetchData} />
         {data && (
            <DataTable
               searchkey="name"
               deleteBulkEndpoint="/api/products/bulk-delete"
               data={data}
               columns={columnProduct}
               onRefresh={fetchData}
               dataAddition={
                  <div className="flex items-center gap-4">
                     <div className="">LIMIT PRODUCT: </div>
                     <Select
                        value={String(limit)}
                        onValueChange={(val) => setLimit(Number(val))}
                     >
                        <SelectTrigger className="w-[90px]">
                           <SelectValue placeholder="Limit" />
                        </SelectTrigger>

                        <SelectContent>
                           <SelectItem value="10">10</SelectItem>
                           <SelectItem value="20">20</SelectItem>
                           <SelectItem value="30">30</SelectItem>
                        </SelectContent>
                     </Select>
                     <div className="">
                        Total Product Saat ini : {pagination?.totalItems}
                     </div>
                  </div>
               }
            />
         )}
      </>
   )
}
