import { NextFunction, Request, Response } from 'express'
import { db } from '../config/firebase'
import { matchedData, validationResult } from 'express-validator'
import { fetchProducts } from '../services/productService'

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
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

const saveProduct = async (req: Request, res: Response) => {
   const err = validationResult(req)
   if (!err.isEmpty()) {
      res.status(400).json({
         success: false,
         message: err.array()
      })
      return
   }
   const data = matchedData(req)
   try {
      // Tambahkan field createdAt dengan waktu saat ini
      const productData = {
         ...data,
         createdAt: new Date()
      }
      const docRef = await db.collection('product').add(productData)
      res.status(201).json({
         success: true,
         id: docRef.id,
         data: productData
      })
   } catch (error) {
      res.status(500).json({
         success: false,
         message: 'Gagal menyimpan produk',
         error: error instanceof Error ? error.message : error
      })
   }
}

export { getProduct, saveProduct }
