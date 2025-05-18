import { db } from '../config/firebase'

interface Product {
  name: string;
  description: string;
  price: number;
  stok: number;
  image_url: string[];
  categoryId: string;
  categoryName: string;
  createdAt: Date;
}
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
