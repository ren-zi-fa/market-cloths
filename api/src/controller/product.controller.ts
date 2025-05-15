import { Request, Response } from 'express'
import { db } from '../config/firebase'

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

export { getNewProduct }
