'use client'

import { ColumnDef } from '@tanstack/react-table'
import CellAction from './cell-action-category'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Category } from '@/types'

export type CategoryColumn = Category
export const columnCategory: ColumnDef<CategoryColumn>[] = [
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
