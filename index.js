const express = require('express')
const app = express()
const authRoutes = require('./routes/Auth.routes') // Importa tus rutas de autenticación
const appRoutes = require('./routes/App.routes') // Importa tus rutas de autenticación

const appConf = require('./config/app.conf')
// const appRoutes = require('./src/routes/Auth.routes')

app.use(express.json()) // Para poder parsear JSON
// Usa tus rutas de autenticación
app.use(appConf)
app.use(authRoutes)
app.use(appRoutes)

app.listen(4000, () => {
    console.log('Server is running on port 4000')
    console.log('http://localhost:4000')
})
