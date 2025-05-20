type Role = 'admin' | 'user'

interface UserModel {
   avt_image: string
   username: string
   email: string
   password: string
   refresh_token: string
   role: Role
}

interface Access_Token {
   userId: string
   username: string
   tokenType: string
   role: string
   iat: number
   exp: number
}
interface Product {
   name: string
   description: string
   price: number
   stok: number
   image_url: string[]
   category_name: string
   createdAt: Date
}

interface Category {
   id: string
   name: string
   description: string
}
export type { UserModel, Role, Access_Token, Product, Category }
