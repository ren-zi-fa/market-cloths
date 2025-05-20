'use client'

import * as React from 'react'
import {
   ColumnDef,
   ColumnFiltersState,
   SortingState,
   VisibilityState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   useReactTable
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '@/components/ui/table'
import instance from '@/lib/axios'
import { toast } from 'sonner'
import axios from 'axios'
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from './ui/dialog'

interface DataTableProps<TData extends { id: string | number }, TValue> {
   columns: ColumnDef<TData, TValue>[]
   data: TData[]
   searchkey: string
   deleteBulkEndpoint?: string
   onRefresh?: () => void
}

export function DataTable<TData extends { id: string | number }, TValue>({
   data,
   columns,
   searchkey,
   deleteBulkEndpoint,
   onRefresh
}: DataTableProps<TData, TValue>) {
   const [sorting, setSorting] = React.useState<SortingState>([])
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
   )

   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = React.useState({})

   const table = useReactTable({
      data,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      getRowId: (row) => String(row.id),
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection
      }
   })

   const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)
   const [openDelete, setOpenDelete] = React.useState(false)

   const handleBulkDelete = async () => {
      try {
         await instance.delete(`${deleteBulkEndpoint}`, {
            data: { ids: selectedIds }
         })
         toast.success('data berhasil di hapus')
         setOpenDelete(false)
         onRefresh?.()
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const msg =
               error.response?.data?.message || error.message || 'Unknown error'
            toast.error('Gagal menyimpan produk: ' + msg)
         } else {
            toast.error('Gagal menyimpan produk: Unknown error')
         }
      }
   }

   return (
      <div className="w-full">
         <div className="flex items-center py-4">
            {deleteBulkEndpoint && (
               <Button
                  variant="destructive"
                  className="mr-4"
                  disabled={selectedIds.length === 0}
                  onClick={() => setOpenDelete(true)}
               >
                  Hapus
               </Button>
            )}
            <Input
               placeholder="Search..."
               value={
                  (table.getColumn(searchkey)?.getFilterValue() as string) ?? ''
               }
               onChange={(event) =>
                  table.getColumn(searchkey)?.setFilterValue(event.target.value)
               }
               className="max-w-sm"
            />
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                     Columns <ChevronDown />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  {table
                     .getAllColumns()
                     .filter((column) => column.getCanHide())
                     .map((column) => {
                        return (
                           <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                 column.toggleVisibility(!!value)
                              }
                           >
                              {column.id}
                           </DropdownMenuCheckboxItem>
                        )
                     })}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                              </TableHead>
                           )
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {table.getRowModel().rows?.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && 'selected'}
                        >
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center"
                        >
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
         <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
               {table.getFilteredSelectedRowModel().rows.length} of{' '}
               {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  Previous
               </Button>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
               >
                  Next
               </Button>
            </div>
         </div>
         <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Konfirmasi Hapus</DialogTitle>
               </DialogHeader>
               <div>
                  Apakah Anda yakin ingin menghapus kategori berikut?
                  <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                     {selectedIds.map((id) => (
                        <li key={id}>{id}</li>
                     ))}
                  </ul>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setOpenDelete(false)}
                  >
                     Batal
                  </Button>
                  <Button variant="destructive" onClick={handleBulkDelete}>
                     Lanjutkan
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   )
}
