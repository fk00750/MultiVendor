require('dotenv').config()
require('./config/config.database')
const app = require('./app')


const PORT = process.env.PORT || 6000


app.listen(PORT, () => {
    console.log(`server is running on PORT: ${PORT}`)
})