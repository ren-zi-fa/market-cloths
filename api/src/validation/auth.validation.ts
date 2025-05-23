import { checkSchema, ParamSchema } from 'express-validator'
import {
   makeEmailField,
   makeLoginNameField,
   makeUsernameField
} from '../helper/auth.schema'

type FieldSchema = Record<string, ParamSchema>

const passwordField: FieldSchema = {
   password: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Password tidak boleh kosong'
      },
      isLength: {
         options: { min: 6 },
         errorMessage: 'Password minimal 6 karakter'
      },
      matches: {
         options: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
         errorMessage: 'Password harus mengandung huruf dan angka'
      }
   }
}

const passwordConfirmationField: FieldSchema = {
   konfirmasi_password: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Konfirmasi password wajib diisi'
      },
      custom: {
         options: (value, { req }) => {
            if (value !== req.body.password) {
               throw new Error('password yang anda inputkan tidak sesuai')
            }
            return true
         }
      }
   }
}
const makananFavorite: FieldSchema = {
   makanan_favorite: {
      in: ['body'],
      notEmpty: {
         errorMessage: 'Konfirmasi password wajib diisi'
      },
      isString: {
         errorMessage: 'harus berupa string'
      }
   }
}

const registerValidation = checkSchema({
   ...makeUsernameField(),
   ...makeEmailField({
      includeIsEmail: true,
      includeCustomUniqueCheck: true,
      optional: false
   }),
   ...passwordField,
   ...passwordConfirmationField,
   ...makananFavorite
})
const loginValidation = checkSchema({
   ...makeLoginNameField(),
   ...passwordField
})

export { registerValidation, loginValidation }
