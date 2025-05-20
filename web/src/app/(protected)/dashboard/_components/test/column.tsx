'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'


export type BillboardColumn = {
   id: string
   name: string
   description: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
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
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: (info) => info.getValue()
   },
   {
      accessorKey: 'actions',
      cell: ({ row }) => <CellAction data={row.original}></CellAction>
   }
]
