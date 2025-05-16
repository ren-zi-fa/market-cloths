import { Request, Response } from 'express'

import { matchedData, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import vars from '../config/vars'
import {} from 'firebase-admin/firestore'
import { Role } from '../types'
import {
   createUser,
   saveRefreshToken,
   revokeRefreshToken,
   findValidRefreshToken,
   findUserByLoginName,
   findUserById
} from '../services/userService'
import { isUserExist } from '../services/userService'
import crypto from 'node:crypto'
const register = async (req: Request, res: Response) => {
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
      const { password, username, email } = data

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
      await createUser({ email, username, password: hashedPassword, role })

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

const login = async (req: Request, res: Response) => {
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

      const refresh_token = crypto.randomBytes(32).toString('hex')
      await saveRefreshToken(refresh_token, userId)
      res.cookie('refresh_token', refresh_token, {
         httpOnly: true,
         secure: true,
         sameSite: 'strict',
         maxAge: 14 * 24 * 60 * 60 * 1000
      }).json({
         message: 'Login berhasil',
         access_token
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({
         message: 'Terjadi kesalahan pada server',
         error: (error as Error).message
      })
   }
}

const logout = async (req: Request, res: Response) => {
   try {
      const refresh_token = req.cookies?.refresh_token
      if (!refresh_token) {
         res.status(400).json({ message: 'Refresh token tidak ditemukan' })
         return
      }
      await revokeRefreshToken(refresh_token)
      res.clearCookie('refresh_token').json({ message: 'Logout berhasil' })
   } catch (error) {
      res.status(500).json({
         message: 'Gagal logout',
         error: (error as Error).message
      })
   }
}

const refreshToken = async (req: Request, res: Response) => {
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
      // Ambil user dari userId via service
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
      res.json({ access_token })
   } catch (error) {
      res.status(500).json({
         message: 'Gagal refresh token',
         error: (error as Error).message
      })
   }
}

export { register, login, logout, refreshToken }
