'use client'

import { DataTable } from '@/components/datatable'

import React, { useEffect, useState } from 'react'
import {  columns } from './column'
import instance from '@/lib/axios'

const BillboardClient = () => {
   const [data, setData] = useState([])

   useEffect(() => {
      instance
         .get('/api/categories')
         .then((res) => setData(res.data.data))
         .catch((e) => console.log(e))
   }, [])
   console.log(data)

   return (
      <>
         <DataTable searchkey="name" data={data} columns={columns} />
      </>
   )
}

export default BillboardClient
