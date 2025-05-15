import { db } from '../config/firebase'

async function seed() {
   const products = [
      {
         name: 'T-shirt',
         price: 99,
         stok: 12,
         description: 'barang berkualitas',
         image_url: [
            'https://res.cloudinary.com/dschnntvt/image/upload/v1747301613/Rectangle_19_tcqs5c.png',
            'https://res.cloudinary.com/dschnntvt/image/upload/v1747301614/Rectangle_17_rgxvjh.png'
         ],
         createdAt: new Date()
      }
   ]

   const batch = db.batch()

   for (const product of products) {
      const docRef = db.collection('product').doc()
      batch.set(docRef, product)
   }

   try {
      await batch.commit()
      console.log('✅ Seeding selesai!')
      process.exit(0)
   } catch (err) {
      console.error('❌ Gagal seeding:', err)
      process.exit(1)
   }
}

seed()
