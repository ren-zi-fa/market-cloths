import { Request, Response } from 'express'

import { matchedData, validationResult } from 'express-validator'
import {
   createProduct,
   deleteProductByid,
   deleteProductByIds,
   fetchProducts,
   getProductById,
   updateProductById
} from '../services/productService'

const handleGetProducts = async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() })
         return
      }

      const data = matchedData(req, { locations: ['query'] })
      const isNew = data.new as boolean

      const products = await fetchProducts(isNew)
      res.json({ success: true, data: products })
   } catch (error) {
      res.status(500).json({
         success: false,
         error: 'Failed to fetch products'
      })
   }
}
const handleGetProductById = async (req: Request, res: Response) => {
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
      const data = await getProductById(id)
      if (!data) {
         res.status(404).json({
            success: false,
            message: `product with id ${id} not found`
         })
         return
      }
      res.status(200).json({
         success: true,
         message: 'product found',
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
const handleBulkDeleteProducts = async (req: Request, res: Response) => {
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

      const result = await deleteProductByIds(ids)

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
      console.error('Bulk delete product error:', error)
      res.status(500).json({
         success: false,
         message: 'Internal server error'
      })
   }
}
const handleDeleteproduct = async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() })
         return
      }

      const productId = req.params.id

      const deleted = await deleteProductByid(productId)

      if (!deleted) {
         res.status(404).json({
            success: false,
            message: 'product not found.'
         })
         return
      }

      res.status(200).json({
         success: true,
         message: `product with id ${productId} deleted.`
      })
      return
   } catch (error) {
      console.error('Delete product error:', error)
      res.status(500).json({ message: 'Internal server error' })
      return
   }
}

const handleUpdateProduct = async (req: Request, res: Response) => {
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

   // Validasi: minimal salah satu dari name, description, price, stok, atau image_url harus ada
   if (
      !data.name &&
      !data.description &&
      (data.price === undefined || data.price === null) &&
      (data.stok === undefined || data.stok === null) &&
      (!data.image_url ||
         (Array.isArray(data.image_url) && data.image_url.length === 0)) &&
      !data.categoryName
   ) {
      res.status(400).json({
         success: false,
         message:
            'At least one of name, description, price, stok, image_url, or categoryName must be provided'
      })
      return
   }

   try {
      const updated = await updateProductById(id, data)
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
   handleGetProducts,
   handleCreateProduct,
   handleDeleteproduct,
   handleBulkDeleteProducts,
   handleGetProductById,
   handleUpdateProduct
}
