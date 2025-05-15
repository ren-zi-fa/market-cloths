import { Request, Response } from 'express'
import { db } from '../config/firebase'
import { matchedData, validationResult } from 'express-validator'

const getNewProduct = async (req: Request, res: Response) => {
   try {
      // Pastikan hanya true yang diterima
      const request = req.query.new as string
      if (request === 'true') {
         const productsRef = db.collection('product')
         const snapshot = await productsRef
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get()
         const products = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
               id: doc.id,
               ...data,
               createdAt:
                  data.createdAt && data.createdAt.toDate
                     ? data.createdAt.toDate().toISOString()
                     : data.createdAt
            }
         })
         res.json({ data: products })
         return
      } else {
         res.json({ data: [] })
         return
      }
   } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' })
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

export { getNewProduct, saveProduct }
