import { db } from '../config/firebase'
import { Category, Product } from '../types'

export const createProduct = async (productData: Product) => {
   const docRef = await db.collection('product').add(productData)
   return docRef.id
}

export async function fetchProducts(isNew?: boolean) {
   const productsRef = db.collection('product').orderBy('createdAt', 'desc')

   let queryRef = productsRef

   if (isNew === true) {
      queryRef = queryRef.limit(8) // ambil 5 produk terbaru
   } else if (isNew === false) {
      queryRef = queryRef.limit(10) // ambil 10 produk terbaru
   }
   // jika isNew undefined ambil semua produk tanpa limit

   const snapshot = await queryRef.get()

   return snapshot.docs.map((doc) => {
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
}

export async function createCategory({
   name,
   description
}: {
   name: string
   description: string
}) {
   return db.collection('category').add({
      name,
      description
   })
}

export async function getCategories(): Promise<Category[]> {
   const snapshot = await db.collection('category').get()
   return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
   })) as Category[]
}

export async function deleteCategoryById(id: string): Promise<boolean> {
   const docRef = db.collection('category').doc(id)
   const doc = await docRef.get()

   if (!doc.exists) {
      return false
   }

   await docRef.delete()
   return true
}

export async function deleteCategoryByIds(
   ids: string[]
): Promise<{ deletedCount: number; notFoundIds: string[] }> {
   let deletedCount = 0
   const notFoundIds: string[] = []
   const batch = db.batch()

   for (const id of ids) {
      const docRef = db.collection('category').doc(id)
      const doc = await docRef.get()
      if (doc.exists) {
         batch.delete(docRef)
         deletedCount++
      } else {
         notFoundIds.push(id)
      }
   }

   if (deletedCount > 0) {
      await batch.commit()
   }

   return { deletedCount, notFoundIds }
}
