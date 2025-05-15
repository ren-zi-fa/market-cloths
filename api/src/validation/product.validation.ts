import { checkSchema } from 'express-validator'

const productSchema = checkSchema({
   name: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Nama produk wajib diisi'
      },
      isString: {
         errorMessage: 'Nama produk harus berupa string'
      }
   },
   price: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Harga produk wajib diisi'
      },
      isNumeric: {
         errorMessage: 'Harga produk wajib berupa angka'
      }
   },
   stok: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Stok produk wajib diisi'
      },
      isNumeric: {
         errorMessage: 'Stok produk wajib berupa angka'
      }
   },
   description: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Deskripsi produk wajib diisi'
      },
      isString: {
         errorMessage: 'Deskripsi produk harus berupa string'
      }
   },
   image_url: {
      in: ['body'],
      isArray: {
         errorMessage: 'Gambar produk wajib diisi dan berupa array'
      }
   }
})

export { productSchema }
