const express = require("express");
const router = express.Router();
const { migrationUser, tokenVerify } = require("../controllers/User.controller");
// const { migrator1Up } = require('../controllers/migrations.controller')
const { login, testConect, register, newQuery, verifyRegister, password_recover } = require("../controllers/Auth.controller");
const { sendEmail } = require("../services/EmailServices");
const { customerServices, customerConsumption, customerServicesDetail } = require("../controllers/Services.controller");
const { getInvoice, existInvoice } = require("../controllers/Payment.controller");
const { searchByDNI, searchByCuit } = require("../controllers/Procoop.controller");

// RUTAS PARA AUTH

router.post("/login", login);
router.post("/register", register);
router.post("/validationUser", verifyRegister);
router.post("/password_recover", password_recover);
router.post("/existToken", tokenVerify);

router.get("/users", migrationUser);
router.get("/email", sendEmail);

//RUTAS DE SERVICIOS
router.get("/getService", customerServices);
router.get("/getConsumo", customerConsumption);
router.get("/getDetailService", customerServicesDetail);

//RUTAS DE PAGOS
router.get("/facturas", getInvoice);
router.get("/existinvoice", existInvoice);
// router.get('/pruebaMigration', migrator1Up)

router.get("/testConect", testConect);
router.post("/searchDni", searchByDNI);
router.post("/searchCuit", searchByCuit);

module.exports = router;
