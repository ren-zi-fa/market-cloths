'use client'
import React from 'react'
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

import { toast } from 'sonner'
import { ProductColumn } from './column-product'
import FormEditProduct from './FormEditProduct'

interface CellActionProps {
   data: ProductColumn
}

const CellAction = ({ data }: CellActionProps) => {
   const onCopy = () => {
      navigator.clipboard.writeText(data.id)
      toast.success('Category Copied Successfully')
   }
   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
               <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuItem onClick={() => onCopy()}>
                  Copy ID
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <FormEditProduct id={data.id} />
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   )
}

export default CellAction
