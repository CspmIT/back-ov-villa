const express = require('express')
const router = express.Router()
const { migrationUser, tokenVerify, usersRegistered } = require('../controllers/User.controller')
// const { migrator1Up } = require('../controllers/migrations.controller')
const { login, testConect, register, verifyRegister, password_recover } = require('../controllers/Auth.controller')
const { customerServices, customerConsumption } = require('../controllers/Services.controller')
const { getInvoice, existInvoice } = require('../controllers/Invoice.controller')
const { searchByDNI, searchByCuit } = require('../controllers/Procoop.controller')
const { Commentaries, Popups, addPopup, addInformation, Informations, addImageInformation, ImageInformations, Claims, addClaim, 
    Users, addMaterialsClaim, MaterialsClaim, toolsClaim, addTechnicianClaim, TechnicianClaim, methodEnableds, addMethodEnableds
} = require('../controllers/Managment.controller')
const { relationUserCooptech, loginCooptech, tokenCooptech, OVCliente, Methods } = require('../controllers/Cooptech.controller')
const { testConnectionVilla } = require('../database/MySQL.database')
const { paymentStatus } = require('../controllers/Payment.controller')

// RUTAS PARA AUTH

router.post('/generateTokenCooptech', tokenCooptech)
router.post('/loginCooptech', loginCooptech)
router.post('/login', login)
router.post('/register', register)
router.post('/validationUser', verifyRegister)
router.post('/password_recover', password_recover)
router.post('/existToken', tokenVerify)

// RUTAS PARA COOPTECH
router.post('/relationUserCooptech', relationUserCooptech)

// router.get('/users', migrationUser)
// router.get('/email', sendEmail)

//RUTAS DE SERVICIOS
router.get('/getService', customerServices)
router.get('/getConsumo', customerConsumption)

//RUTAS DE PAGOS
router.post('/facturas', getInvoice)
router.get('/existinvoice', existInvoice)
// router.get('/pruebaMigration', migrator1Up)
// router.get('/MigrationLocation', migrationCity)

router.get('/testConect', testConect)
router.post('/searchDni', searchByDNI)
router.post('/searchCuit', searchByCuit)

//RUTAS INTERNAS
router.get('/Commentaries', Commentaries)
router.get('/getPopups', Popups)
router.post('/addPopup', addPopup)
router.post('/addInformation', addInformation)
router.get('/informations', Informations)
router.post('/addImageInformation', addImageInformation)
router.get('/imageInformations', ImageInformations)
router.get('/getUsersRegistered', usersRegistered)
router.post('/addClaim', addClaim)
router.post('/Claims', Claims)
router.post('/Users', Users)
router.post('/addMaterialsClaim', addMaterialsClaim)
router.get('/getMaterialsClaim', MaterialsClaim)
router.get('/toolsClaim', toolsClaim)
router.post('/addTechnicianClaim', addTechnicianClaim)
router.get('/getTechnicianClaim', TechnicianClaim)
router.post('/addMethodEnableds', addMethodEnableds)
router.get('/getmethodEnableds', methodEnableds)
router.get('/estadoPago', paymentStatus)


//datos cooptech 
router.get('/OVCliente/:id', OVCliente);
router.get('/getMethods', Methods);

router.get('/testConnection', testConnectionVilla);


module.exports = router
