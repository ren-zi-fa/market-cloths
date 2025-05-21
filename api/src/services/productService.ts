import { db } from '../config/firebase'
import vars from '../config/vars'
import { Category, Product } from '../types'

export const createProduct = async (productData: Product) => {
   const docRef = await db.collection('product').add(productData)
   return docRef.id
}

export async function fetchProducts(
   category?: string,
   limit: number = vars.LIMIT_PRODUCT,
   page: number = 1,
   search?: string
) {
   let queryRef = db.collection('product').orderBy('createdAt', 'desc')

   if (category) {
      queryRef = queryRef.where('category_name', '==', category)
   }

   const snapshot = await queryRef.get()

   let docs = snapshot.docs

   if (search) {
      const searchLower = search.toLowerCase()
      docs = docs.filter((doc) => {
         const data = doc.data()
         const name = (data.name || '').toString().toLowerCase()
         const description = (data.description || '').toString().toLowerCase()
         const price = data.price !== undefined ? String(data.price) : ''
         const category_name = (data.category_name || '')
            .toString()
            .toLowerCase()
         return (
            name.includes(searchLower) ||
            description.includes(searchLower) ||
            category_name.includes(searchLower) ||
            price.includes(searchLower)
         )
      })
   }

   const totalItems = docs.length
   const totalPages = Math.ceil(totalItems / limit)

   const offset = (page - 1) * limit
   const pagedDocs = docs.slice(offset, offset + limit)

   const data = pagedDocs.map((doc) => {
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

   return {
      data,
      totalItems,
      totalPages
   }
}

export async function deleteProductByid(id: string): Promise<boolean> {
   const docRef = db.collection('product').doc(id)
   const doc = await docRef.get()

   if (!doc.exists) {
      return false
   }

   await docRef.delete()
   return true
}

export async function deleteProductByIds(
   ids: string[]
): Promise<{ deletedCount: number; notFoundIds: string[] }> {
   let deletedCount = 0
   const notFoundIds: string[] = []
   const batch = db.batch()

   for (const id of ids) {
      const docRef = db.collection('product').doc(id)
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
export async function updateProductById(
   id: string,
   data: Partial<{ name: string; description: string }>
): Promise<boolean> {
   const docRef = db.collection('product').doc(id)
   const doc = await docRef.get()

   if (!doc.exists) {
      return false
   }

   await docRef.update(data)
   return true
}
export async function getProductById(id: string): Promise<Category | null> {
   const docRef = db.collection('product').doc(id)
   const doc = await docRef.get()
   if (!doc.exists) {
      return null
   }
   return {
      id: doc.id,
      ...doc.data()
   } as Category
}
