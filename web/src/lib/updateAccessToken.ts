import { NextRequest } from 'next/server'

export function updateAccessToken(request: NextRequest) {
   const access_token = request.cookies.get('access_token')?.value as string
   if (access_token) {
      
   }
}
