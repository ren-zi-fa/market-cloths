import express from 'express'
import vars from './config/vars'

const app = express()
const PORT = vars.port
app.get('/', (req, res) => {
   res.json({
      message: 'hello'
   })
})

app.listen(PORT, () =>
   console.log('app is running on http://localhost:' + PORT)
)
