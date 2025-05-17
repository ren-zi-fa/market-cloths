import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET as string
export function updateAccessToken(request: NextRequest) {
   const access_token = request.cookies.get('access_token')?.value as string
   if (access_token) {
      
   }
}
