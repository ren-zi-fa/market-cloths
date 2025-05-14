import path from 'path'
import dotenv from 'dotenv'

// Gantikan __dirname
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Export config
export default {
   port: process.env.PORT as string
}
