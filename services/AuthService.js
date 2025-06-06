const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SequelizeVilla } = require('../database/MySQL.database')
const { db, changeSchema } = require('../models')
const { Sequelize } = require('sequelize')
const { sendEmail } = require('./EmailServices')
const { getLevel } = require('./UserService')
const { getDataProcoopxId } = require('./ProcoopService')
const { getAditionalInfo } = require('./ManagmentService')

const secret = process.env.SECRET

async function newQuery() {
	try {
		const users = await db.User.findAll()
		return users
	} catch (error) {
		console.error('ERROR DE DATABASE:', error)
	}
}

// Funcion para firmar el token
const signToken = (user, remember) => {
	// Seteo de fecha con 2 años mas para expiracion
	const dateYear = new Date().setFullYear(new Date().getFullYear() + 2)
	// Seteo de fecha con 8horas mas para expiracion
	const dateHour = new Date().setHours(new Date().getHours() + 8)
	const configSing = {
		iss: `app-coopm_villa`,
		sub: user.id,
		iat: new Date().getTime(),
		exp: new Date(remember ? dateYear : dateHour).getTime(),
		name: user.name_register,
		lastName: user.last_name_register,
		number_customer: user.number_customer,
		level: user.level,
		TypeUser: user.type_person,
		dark: user.dark,
		img_profile: user.img_profile,
		type_person: user.type_person,
	}
	return jwt.sign(configSing, secret)
}

// Funcion para firmar el token para usuario interno
const signTokenCooptech = (user, schemaName) => {
	// Seteo de fecha con 8horas mas para expiracion
	const dateHour = new Date().setHours(new Date().getHours() + 8)
	const configSing = {
		iss: `app-${schemaName}`,
		sub: user.id,
		iat: new Date().getTime(),
		exp: new Date(dateHour).getTime(),
		name: user.name_register,
		lastName: user.last_name_register,
		profile: user.profile,
		dark: user.dark,
		img_profile: user.img_profile,
	}
	return jwt.sign(configSing, secret)
}

// Funcion para firmar el token para pasar por url para logearse desde cooptech
const generateTokenCooptech = async (email, tokenCooptech, schemaName) => {
	// Seteo de fecha con 8horas mas para expiracion
	const dateHour = new Date().setHours(new Date().getHours() + 1)
	const configSing = {
		iss: `app-${schemaName}`,
		iat: new Date().getTime(),
		exp: new Date(dateHour).getTime(),
		email: email,
		token: tokenCooptech,
		schemaName,
	}
	return jwt.sign(configSing, secret)
}

const login = async (email, password, remember) => {
	try {
		const user = await db.User.findOne({ where: { email: email } })
		if (!user) {
			throw new Error('El usuario o la contraseña son incorrectas')
		}
		if (!user.dataValues.email_verified) {
			throw new Error('El usuario no esta verificado')
		}
		let hash = user.password
		hash = hash.replace(/^\$2y(.+)$/i, '$2a$1')
		const isMatch = await bcrypt.compare(password, hash)
		if (!isMatch) {
			throw new Error('El usuario o la contraseña son incorrectas')
		}
		const dataPeople = await getLevel(user.id)
		let accountPrimary
		if (dataPeople) {
			accountPrimary = dataPeople.filter((item) => {
				let data = item.get()
				if (data.primary_account === true) {
					return item
				}
			})
		}
		user.level = accountPrimary[0]?.level || 1
		if (accountPrimary[0]) {
			const number_customer = await getDataProcoopxId(accountPrimary[0].id_person)
			user.number_customer = number_customer.number_customer
			if(number_customer.number_customer){
				const name_customer = await getAditionalInfo(number_customer.number_customer)
				console.log(name_customer);
				user.name_customer = name_customer?.nombre
			}
		}
		console.log(user);
		return signToken(user, remember)
	} catch (error) {
		throw error
	}
}


const authCooptech = async (email, token, schemaName) => {
	try {
		await changeSchema(schemaName)
		const user = await db.User.findOne({ where: { email: email } })
		if (!user) {
			throw new Error('El usuario o la contraseña son incorrectas')
		}
		if (user.token_app !== token) {
			throw new Error('El usuario o la contraseña son incorrectas2')
		}
		const employee = await db.Person_physical.findOne({
			where: { id_person: user.id_person_profile },
			include: [
				{
					model: db.Employee,
					as: 'personPhysical',
					where: { id_person_physical: db.Sequelize.col('Person_physical.id') },
				},
			],
		})
		user.profile = employee.personPhysical.profile
		return signTokenCooptech(user, schemaName)
	} catch (error) {
		throw error
	}
}

const testConection = async () => {
	try {
		await SequelizeVilla.authenticate()
	} catch (error) {
		console.error('ERROR DE DATABASE:', error)
	}
}
const registerUser = async (data, url) => {
	try {
		const user = await db.User.create(data)
		const urlAthentificate = `${url}/login/${data.token_temp}/${user.id}`
		await sendEmail(data, urlAthentificate)
		return data
	} catch (error) {
		if (error instanceof Sequelize.ValidationError) {
			let listErrors = []
			error.errors.forEach((e) => {
				listErrors.push(e.message)
			})
			throw new Error(listErrors)
		} else {
			throw error
		}
	}
}

// const logout = async (req, res) => {
// 	try {
// 		const id = req.cookies.token.sub
// 		const user = await db_coopm_v1.UserDesarrollo.findOne({ where: { id: id } })
// 	} catch (error) {
// 		res.status(400).json({ error: error.message })
// 	}
// }

module.exports = { testConection, login, newQuery, registerUser, authCooptech, generateTokenCooptech }
