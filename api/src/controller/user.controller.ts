import { Request, Response } from 'express'

import { matchedData, validationResult } from 'express-validator'

import vars from '../config/vars'
import { getAllUser } from '../services/userService'

const handleGetAllUser = async (req: Request, res: Response) => {
   try {
      const dataUser = await getAllUser()
      res.status(200).json({
         success: true,
         message: 'data berhasil didapatkan',
         data:dataUser
      })
   } catch (error) {
    console.error('Fetch data user error:', error)
      res.status(500).json({
         success: false,
         error: error instanceof Error ? error.message : String(error)
      })
   }
}

export { handleGetAllUser }
