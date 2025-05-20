import { Request, Response } from 'express'

import { matchedData, validationResult } from 'express-validator'
import {
   createCategory,
   deleteCategoryById,
   deleteCategoryByIds,
   getCategories,
   getCategoryById,
   updateCategoryById
} from '../services/categoryService'

const handleCreateCategory = async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
         })
         return
      }

      const data = matchedData(req)
      const { name, description } = data

      await createCategory({ name, description })

      res.status(201).json({
         success: true,
         message: 'Category created successfully'
      })
      return
   } catch (err) {
      console.error(err)
      res.status(500).json({
         success: false,
         message: 'Internal server error',
         error: err instanceof Error ? err.message : String(err)
      })
      return
   }
}
const handleGetCategories = async (req: Request, res: Response) => {
   try {
      const categories = await getCategories()

      res.status(200).json({
         success: true,
         message: 'Data kategori berhasil diambil',
         data: categories
      })
      return
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Terjadi kesalahan saat mengambil data kategori',
         error: error instanceof Error ? error.message : error
      })
      return
   }
}

const handleDeleteCategory = async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() })
         return
      }

      const categoryId = req.params.id

      const deleted = await deleteCategoryById(categoryId)

      if (!deleted) {
         res.status(404).json({
            success: false,
            message: 'Category not found.'
         })
         return
      }

      res.status(200).json({
         success: true,
         message: `Category with id ${categoryId} deleted.`
      })
      return
   } catch (error) {
      console.error('Delete category error:', error)
      res.status(500).json({ message: 'Internal server error' })
      return
   }
}

const handleBulkDeleteCategory = async (req: Request, res: Response) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      res.status(400).json({
         success: false,
         message: 'Validation failed',
         errors: errors.array()
      })
      return
   }

   try {
      const { ids } = req.body

      const result = await deleteCategoryByIds(ids)

      if (result.notFoundIds.length > 0) {
         res.status(400).json({
            success: false,
            message: 'Beberapa ID tidak ditemukan',
            notFoundIds: result.notFoundIds
         })
         return
      }

      res.status(200).json({
         success: true,
         message: 'Bulk delete completed',
         deletedCount: result.deletedCount
      })
   } catch (error) {
      console.error('Bulk delete category error:', error)
      res.status(500).json({
         success: false,
         message: 'Internal server error'
      })
   }
}

const handleGetCategoryId = async (req: Request, res: Response) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      res.status(400).json({
         success: false,
         message: 'Validation failed',
         errors: errors.array()
      })
      return
   }
   const id = req.params.id
   try {
      const data = await getCategoryById(id)
      if (!data) {
         res.status(404).json({
            success: false,
            message: `Category with id ${id} not found`
         })
         return
      }
      res.status(200).json({
         success: true,
         message: 'Category found',
         data
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Internal server error',
         error: error instanceof Error ? error.message : String(error)
      })
   }
}
const handleUpdateCategory = async (req: Request, res: Response) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      res.status(400).json({
         success: false,
         message: 'Validation failed',
         errors: errors.array()
      })
      return
   }

   const id = req.params.id
   const data = matchedData(req)

   // Validasi: minimal salah satu dari name atau description harus ada
   if (!data.name && !data.description) {
      res.status(400).json({
         success: false,
         message: 'At least one of name or description must be provided'
      })
      return
   }

   try {
      const updated = await updateCategoryById(id, data)
      if (!updated) {
         res.status(404).json({
            success: false,
            message: 'Category not found'
         })
         return
      }
      res.status(200).json({
         success: true,
         message: 'Category updated successfully'
      })
   } catch (error) {
      console.error('Update category error:', error)
      res.status(500).json({
         success: false,
         message: 'Internal server error'
      })
   }
}

export {
   handleCreateCategory,
   handleGetCategories,
   handleDeleteCategory,
   handleBulkDeleteCategory,
   handleUpdateCategory,
   handleGetCategoryId
}
