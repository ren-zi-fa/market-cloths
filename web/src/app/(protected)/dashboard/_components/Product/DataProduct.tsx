'use client'

import { DataTable } from '@/components/datatable'

import React, { useEffect } from 'react'

import FormProduct from './FormProduct'
import { columnProduct } from './column-product'
import { useProductStore } from '@/hooks/product-store'

export default function DataProduct() {
   const { data, fetchData } = useProductStore()

   useEffect(() => {
      fetchData()
   }, [fetchData])

   return (
      <>
         <FormProduct onSucces={fetchData} />
         {data && (
            <DataTable
               searchkey="name"
               deleteBulkEndpoint="/api/products/bulk-delete"
               data={data}
               columns={columnProduct}
               onRefresh={fetchData}
            />
         )}
      </>
   )
}
