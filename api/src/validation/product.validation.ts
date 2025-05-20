import { checkSchema, ParamSchema } from 'express-validator'

type FieldSchema = Record<string, ParamSchema>

// Definisikan schema validasi sebagai object biasa
const productSchema: FieldSchema = {
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
   },
   category_name: {
      in: ['body'],
      notEmpty: { errorMessage: 'Nama kategori wajib diisi' },
      isString: { errorMessage: 'Nama kategori harus berupa string' }
   }
}
const categorySchema: FieldSchema = {
   name: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Name is required'
      },
      isString: {
         errorMessage: 'Name must be a string'
      }
   },
   description: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Description is required'
      },
      isString: {
         errorMessage: 'Description must be a string'
      }
   }
}

const productValidation = checkSchema(productSchema)
const categoryValidation = checkSchema(categorySchema)

export { productValidation, categoryValidation }
