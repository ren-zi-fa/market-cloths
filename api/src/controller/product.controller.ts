import { Request, Response } from 'express'

import { matchedData, validationResult } from 'express-validator'
import {
   createCategory,
   createProduct,
   deleteCategoryById,
   fetchProducts,
   getCategories
} from '../services/productService'

const handleGetProduct = async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() })
         return
      }

      const data = matchedData(req, { locations: ['query'] })
      const isNew = data.new as boolean

      const products = await fetchProducts(isNew)
      res.json({ data: products })
   } catch (error) {
      res.status(500).json({
         success: false,
         error: 'Failed to fetch products'
      })
   }
}

const handleCreateProduct = async (req: Request, res: Response) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      res.status(400).json({
         success: false,
         message: errors.array()
      })
      return
   }

   const data = matchedData(req)
   const {
      name,
      image_url,
      price,
      stok,
      description,
      categoryId,
      categoryName
   } = data
   try {
      const productData = {
         name,
         categoryId,
         categoryName,
         price,
         stok,
         description,
         image_url,
         createdAt: new Date()
      }

      const id = await createProduct(productData)

      res.status(201).json({
         success: true,
         id,
         message: 'data berhasil di tambahkan'
      })
      return
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Internal server error',
         error: error instanceof Error ? error.message : error
      })
      return
   }
}

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
      console.error(err) // log ke konsol jika diperlukan
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
      // Validasi request menggunakan express-validator
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() })
         return
      }

      const categoryId = req.params.id

      const deleted = await deleteCategoryById(categoryId)

      if (!deleted) {
         res.status(404).json({ message: 'Category not found.' })
         return
      }

      res.status(200).json({
         message: `Category with id ${categoryId} deleted.`
      })
      return
   } catch (error) {
      console.error('Delete category error:', error)
      res.status(500).json({ message: 'Internal server error' })
      return
   }
}
export {
   handleGetProduct,
   handleCreateProduct,
   handleCreateCategory,
   handleGetCategories,
   handleDeleteCategory
}
