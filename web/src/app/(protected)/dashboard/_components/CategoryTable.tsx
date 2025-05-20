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
import { ArrowUpDown, ChevronDown } from 'lucide-react'

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
import FormCategory from './FormCategory'
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Category } from '@/types'
import axios from 'axios'

export const columns: ColumnDef<Category>[] = [
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
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => info.getValue()
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
   }
]

export default function CategoryTable() {
   const [categories, setCategories] = React.useState<Category[]>([])
   const [sorting, setSorting] = React.useState<SortingState>([])
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
   )
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
   const [rowSelection, setRowSelection] = React.useState({})
   const [openDelete, setOpenDelete] = React.useState(false)

   const fetchCategories = React.useCallback(() => {
      instance
         .get('/api/categories')
         .then((res) => {
            setCategories(res.data.data)
         })
         .catch(() => setCategories([]))
   }, [])

   React.useEffect(() => {
      fetchCategories()
   }, [fetchCategories])

   const table = useReactTable({
      data: categories,
      columns,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getRowId: (row) => row.id
   })

   // Ambil id row yang terpilih
   const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id)

   console.log('selectedIds', selectedIds)

   // Fungsi handle delete
   const handleBulkDelete = async () => {
      try {
         await instance.delete('/api/categories/bulk-delete', {
            data: { ids: selectedIds }
         })
         toast.success('data berhasil di hapus')
         setOpenDelete(false)
         fetchCategories()
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
         <div className="flex items-center py-4 space-x-4">
            <Input
               placeholder="Filter nama kategori..."
               value={
                  (table.getColumn('name')?.getFilterValue() ?? '') as string
               }
               onChange={(e) =>
                  table.getColumn('name')?.setFilterValue(e.target.value)
               }
               className="max-w-sm"
            />
            <FormCategory onSuccess={fetchCategories} />
            <Button
               variant="destructive"
               disabled={selectedIds.length === 0}
               onClick={() => setOpenDelete(true)}
            >
               Hapus
            </Button>
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
                     .map((column) => (
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
                     ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                           <TableHead key={header.id}>
                              {header.isPlaceholder
                                 ? null
                                 : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                   )}
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>

               <TableBody>
                  {table.getRowModel().rows.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={
                              row.getIsSelected() ? 'selected' : undefined
                           }
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
                           Tidak ada data
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

         {/* Modal Konfirmasi Hapus */}
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