'use client'

import { DataTable } from '@/components/datatable'

import React, { useEffect } from 'react'
import { columnCategory } from './column-category'
import FormCategory from './FormCategory'
import { useCategoryStore } from '@/hooks/category-store'

export default function DataCategory() {
   const { data, fetchData } = useCategoryStore()

   useEffect(() => {
      fetchData()
   }, [fetchData])

   return (
      <>
         <FormCategory onSucces={fetchData} />
         {data && (
            <DataTable
               searchkey="name"
               deleteBulkEndpoint="/api/categories/bulk-delete"
               data={data}
               columns={columnCategory}
               onRefresh={fetchData}
            />
         )}
      </>
   )
}
