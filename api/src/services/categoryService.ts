import { db } from '../config/firebase'
import { Category } from '../types'

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
   if (!id || typeof id !== 'string' || !id.trim()) {
      return false
   }

   try {
      const docRef = db.collection('category').doc(id)
      const doc = await docRef.get()

      if (!doc.exists) {
         return false
      }

      await docRef.delete()
      return true
   } catch (error) {
      console.error('Error deleting category:', error)
      return false
   }
}

export async function deleteCategoryByIds(
   categoriesId: string[]
): Promise<{ deletedCount: number; notFoundIds: string[] }> {
   let deletedCount = 0
   const notFoundIds: string[] = []
   const batch = db.batch()

   for (const id of categoriesId) {
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

export async function updateCategoryById(
   id: string,
   data: Partial<{ name: string; description: string }>
): Promise<boolean> {
   const docRef = db.collection('category').doc(id)
   const doc = await docRef.get()

   if (!doc.exists) {
      return false
   }

   await docRef.update(data)
   return true
}

export async function getCategoryById(id: string): Promise<Category | null> {
   const docRef = db.collection('category').doc(id)
   const doc = await docRef.get()
   if (!doc.exists) {
      return null
   }
   return {
      id: doc.id,
      ...doc.data()
   } as Category
}
