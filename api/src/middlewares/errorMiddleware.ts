import { Request, Response, NextFunction } from 'express'

export function errorMiddleware(
   err: any,
   req: Request,
   res: Response,
   next: NextFunction
) {
   console.error('Internal server error:', err)
   res.status(500).json({
      success: false,
      message: 'Internal server error'
   })
}
