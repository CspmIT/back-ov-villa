const express = require('express')
const router = express.Router()
const { migrationUser } = require('../controllers/User.controller')
// const { migrator1Up } = require('../controllers/migrations.controller')
const { login, testConect, register, } = require('../controllers/Auth.controller')

// RUTAS PARA AUHT


router.post('/login', login)
router.post('/register', register)
router.get('/users', migrationUser)
// router.get('/pruebaMigration', migrator1Up)

router.get('/testConect', testConect)

module.exports = router
