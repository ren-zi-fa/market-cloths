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

export type { UserModel, Role, Access_Token }
