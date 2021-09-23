const app = require('./controllers/api')
const consola = require('consola')

const PORT = 7000


app.listen(PORT, () => {
  consola.success(`server running on port ${PORT}`)
})