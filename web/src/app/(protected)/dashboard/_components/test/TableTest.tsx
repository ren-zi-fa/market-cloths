'use client'

import { DataTable } from '@/components/datatable'

import React, { useEffect, useState } from 'react'
import { columns } from './column'
import instance from '@/lib/axios'
import { Category } from '@/types'

const BillboardClient = () => {
   const [data, setData] = useState<Category[]>([])

   const fetchData = () => {
      instance
         .get('/api/categories')
         .then((res) => setData(res.data.data))
         .catch((e) => console.log(e))
   }

   useEffect(() => {
      fetchData()
   }, [])

   return (
      <>
         {data && (
            <DataTable
               searchkey="name"
               deleteBulkEndpoint="/api/categories/bulk-delete"
               data={data}
               columns={columns}
               onRefresh={fetchData}
            />
         )}
      </>
   )
}

export default BillboardClient
