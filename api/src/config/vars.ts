import path from 'path'
import dotenv from 'dotenv'

// Gantikan __dirname
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Export config
export default {
   port: process.env.PORT as string,
   FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT as string,
   JWT_SECRET: process.env.JWT_SECRET as string
}
