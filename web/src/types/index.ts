interface Iproduct {
   id: string
   name: string
   price: number
   stok: number
   image_url: string[]
   createdAt: string
   description: string
}
interface User {
   userId: string
   username: string
   email: string
   tokenType: string
   role: string
}
type FieldErrorMessage = {
  type: 'field';
  path: string;
  msg: string;
};


export type { Iproduct, User,FieldErrorMessage }
