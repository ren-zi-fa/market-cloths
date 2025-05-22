import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import vars from '../config/vars'
import { Role } from '../types'
import {
   createUser,
   saveRefreshToken,
   revokeRefreshToken,
   findValidRefreshToken,
   findUserByLoginName,
   findUserById,
   checkRefreshToken,
   deleteRefreshToken
} from '../services/userService'
import { isUserExist } from '../services/userService'
import crypto from 'node:crypto'

const handleRegister = async (req: Request, res: Response) => {
   try {
      const role: Role = 'user'
      const result = validationResult(req)
      if (!result.isEmpty()) {
         res.status(400).json({
            success: false,
            message: result.array()
         })
         return
      }

      const data = matchedData(req)
      const { password, username, email, makanan_favorite } = data

      // CEK USER SUDAH ADA
      const exist = await isUserExist(email, username)
      if (exist) {
         res.status(400).json({
            success: false,
            message: 'User dengan email atau username tersebut sudah terdaftar'
         })
         return
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await createUser({
         email,
         username,
         password: hashedPassword,
         role,
         makanan_favorite
      })

      res.status(201).json({
         success: true,
         message: 'Registrasi berhasil silahkan login'
      })
   } catch (error) {
      console.error((error as Error).message)
      res.status(500).json({
         success: false,
         message: 'Terjadi kesalahan saat registrasi'
      })
   }
}

const handleLogin = async (req: Request, res: Response) => {
   try {
      const result = validationResult(req)
      if (!result.isEmpty()) {
         res.status(400).json({
            success: false,
            message: result.array()
         })
         return
      }

      const data = matchedData(req)
      const { login_name, password } = data
      const found = await findUserByLoginName(login_name)
      if (!found) {
         res.status(400).json({
            message: 'Username atau email tidak ditemukan'
         })
         return
      }

      const { userId, user } = found

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
         res.status(400).json({ message: 'Password salah' })
         return
      }

      const JWT_SECRET = vars.JWT_SECRET as string

      const access_token = jwt.sign(
         {
            userId,
            username: user.username,
            email: user.email,
            tokenType: 'access',
            role: user.role
         },
         JWT_SECRET,
         { expiresIn: '15m' }
      )
      const existingValidToken = await checkRefreshToken(userId)

      if (existingValidToken) {
         await deleteRefreshToken(userId, false)
         console.log('Refresh token yang direvoke telah dihapus.')
      } else {
         console.log('Tidak ada refresh token yang direvoke.')
      }

      const refresh_token = crypto.randomBytes(32).toString('hex')

      await saveRefreshToken(refresh_token, userId)
      res.cookie('access_token', access_token, {
         httpOnly: false,
         secure: false,
         sameSite: 'lax',
         maxAge: vars.ACCESS_TOKEN_MAX_AGE
      })
         .cookie('refresh_token', refresh_token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: vars.REFRESH_TOKEN_MAX_AGE
         })
         .json({
            success: true,
            message: 'Login berhasil'
         })
   } catch (error) {
      console.error(error)
      res.status(500).json({
         message: 'Terjadi kesalahan pada server',
         error: (error as Error).message
      })
   }
}

const handleLogout = async (req: Request, res: Response) => {
   try {
      const refresh_token = req.cookies?.refresh_token
      if (!refresh_token) {
         res.status(400).json({ message: 'Refresh token tidak ditemukan' })
         return
      }
      await revokeRefreshToken(refresh_token)
      res.clearCookie('refresh_token')
         .clearCookie('access_token')
         .json({ message: 'Logout berhasil' })
   } catch (error) {
      res.status(500).json({
         message: 'Gagal logout',
         error: (error as Error).message
      })
   }
}

const handleRefreshToken = async (req: Request, res: Response) => {
   try {
      const refresh_token = req.cookies?.refresh_token
      if (!refresh_token) {
         res.status(400).json({ message: 'Refresh token tidak ditemukan' })
         return
      }
      const tokenData = await findValidRefreshToken(refresh_token)
      if (!tokenData) {
         res.status(401).json({
            message: 'Refresh token tidak valid atau sudah kadaluarsa'
         })
         return
      }

      const found = await findUserById(tokenData.userId)
      if (!found) {
         res.status(404).json({ message: 'User tidak ditemukan' })
         return
      }
      const { userId, user } = found
      const JWT_SECRET = vars.JWT_SECRET as string
      const access_token = jwt.sign(
         {
            userId,
            username: user?.username,
            email: user?.email,
            tokenType: 'access',
            role: user?.role
         },
         JWT_SECRET,
         { expiresIn: '15m' }
      )
      res.cookie('access_token', access_token, {
         httpOnly: false,
         secure: false,
         sameSite: 'lax',
         maxAge: vars.ACCESS_TOKEN_MAX_AGE
      }).json({ success: true, message: 'Token diperbarui' })
   } catch (error) {
      res.status(500).json({
         message: 'Gagal refresh token',
         error: (error as Error).message
      })
   }
}

const handleProfile = async (req: Request, res: Response) => {
   try {
      const token = req.cookies?.access_token
      if (!token) {
         res.status(401).json({ message: 'Unauthorized' })
         return
      }
      const JWT_SECRET = vars.JWT_SECRET as string
      let payload: JwtPayload | string
      try {
         payload = jwt.verify(token, JWT_SECRET)
      } catch {
         res.status(401).json({ message: 'Unauthorized' })
         return
      }
      // Ambil userId dari payload
      const userId = (payload as any).userId
      if (!userId) {
         res.status(401).json({ message: 'Unauthorized' })
         return
      }
      const found = await findUserById(userId)
      if (!found) {
         res.status(404).json({ message: 'User tidak ditemukan' })
         return
      }
      // Jangan kirim password ke client
      const { ...data } = found.user
      res.json({ user: { userId: found.userId, ...data } })
   } catch (error) {
      res.status(500).json({
         message: 'Gagal mengambil profile',
         error: (error as Error).message
      })
   }
}

export {
   handleRegister,
   handleLogin,
   handleLogout,
   handleRefreshToken,
   handleProfile
}
