
type Role = 'author' | 'buyer'

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
interface Refresh_Token {
   userId: string
   tokenType: string
   iat: number
   exp: number
}
export type {
   Refresh_Token,
   UserModel,
   Role,
   Access_Token
}