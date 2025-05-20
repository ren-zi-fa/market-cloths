'use client'
import React, { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { BillboardColumn } from './column'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AlertModal from '@/components/modals/alert-modal'
import instance from '@/lib/axios'

interface CellActionProps {
   data: BillboardColumn
}

const CellAction = ({ data }: CellActionProps) => {
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const router = useRouter()
   const params = useParams()

   const onDelete = async () => {
      try {
         setLoading(true)
         await instance.delete(`/api/categories/${data.id}`)
         toast.success('Billboard deleted')
         router.refresh()
      } catch (error) {
         toast.error('Something went wrong')
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }
   const onCopy = (id: string) => {
      navigator.clipboard.writeText(data.id)
      toast.success('Billboard Copied Successfully')
   }
   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuItem onClick={() => onCopy(data.id)}>
                  Copy Data ID
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem
                  onClick={() =>
                     router.push(`/${params.storeId}/billboards/${data.id}`)
                  }
               >
                  Update
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setOpen(true)}>
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   )
}

export default CellAction
