interface Iproduct {
   id: string
   name: string
   price: number
   stok: number
   image_url: string[]
   createdAt: string
   description: string
   category_name: string
}
interface User {
   userId: string
   username: string
   email: string
   tokenType: string
   role: string
   exp: number
   iat: number
}
type FieldErrorMessage = {
   type: 'field'
   path: string
   msg: string
}
type Category = {
   id: string
   name: string
   description: string
}

export type { Iproduct, User, FieldErrorMessage, Category }
