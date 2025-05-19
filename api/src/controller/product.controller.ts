import { Request, Response } from 'express'

import { matchedData, validationResult } from 'express-validator'
import { createProduct, fetchProducts } from '../services/productService'

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
      res.json({ success: true, data: products })
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

export { handleGetProduct, handleCreateProduct }
