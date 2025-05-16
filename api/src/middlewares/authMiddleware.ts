import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import vars from '../config/vars'

const JWT_SECRET = vars.JWT_SECRET as string
const ensureEmailOrUsername = (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   const { login_name } = req.body

   if (!login_name) {
      res.status(400).json({
         success: false,
         message: 'Email atau Username harus diisi salah satu.'
      })
      return
   }

   next()
}

const verifyUserRole = (requiredRole: string) => {
   return (req: Request, res: Response, next: NextFunction) => {
      try {
         const authHeader = req.headers.authorization

         if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No token provided' })
            return
         }

         const token = authHeader.split(' ')[1]

         const decoded = jwt.verify(token, JWT_SECRET) as {
            role?: string
            [key: string]: any
         }
         console.log(decoded)

         if (!decoded.role) {
            res.status(403).json({ message: 'Role not found in token' })
            return
         }

         // Cek role
         if (decoded.role !== requiredRole) {
            res.status(403).json({
               message: 'Access denied: insufficient role'
            })
            return
         }

         // Simpan data user (opsional, biar route handler bisa akses)
         ;(req as any).user = decoded

         next()
      } catch (error) {
         res.status(401).json({ message: 'Invalid or expired token' })
         return
      }
   }
}

export { ensureEmailOrUsername, verifyUserRole }