'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import CellAction from './cell-action-product'
import { Iproduct } from '@/types'
import Image from 'next/image'

export type ProductColumn = Iproduct

export const columnProduct: ColumnDef<ProductColumn>[] = [
   {
      id: 'select',
      header: ({ table }) => (
         <Checkbox
            checked={
               table.getIsAllPageRowsSelected() ||
               (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
               table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
         />
      ),
      cell: ({ row }) => (
         <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
         />
      ),
      enableSorting: false,
      enableHiding: false
   },
   {
      header: 'Gambar',
      accessorFn: (row) => row.image_url?.[0] || '',
      cell: (info) => {
         const url = info.getValue() as string
         return url ? (
            <div className="relative h-12 w-12">
               <Image
                  src={url}
                  alt="gambar"
                  fill
                  sizes="48px"
                  className="object-cover rounded"
                  style={{ objectFit: 'cover', borderRadius: '0.375rem' }}
                  loading="lazy"
               />
            </div>
         ) : null
      }
   },

   {
      accessorKey: 'name',
      header: ({ column }) => (
         <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
         >
            Nama <ArrowUpDown className="ml-1 inline" />
         </Button>
      ),
      cell: (info) => info.getValue()
   },
   {
      accessorKey: 'category_name',
      header: ({ column }) => (
         <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
         >
            Category <ArrowUpDown className="ml-1 inline" />
         </Button>
      ),
      cell: (info) => info.getValue()
   },
   {
      accessorKey: 'price',
      header: 'Price',
      cell: (info) => info.getValue()
   },
   {
      accessorKey: 'stok',
      header: 'Stok',
      cell: (info) => info.getValue()
   },
   {
      accessorKey: 'actions',
      cell: ({ row }) => <CellAction data={row.original}></CellAction>
   }
]
