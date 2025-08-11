const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { SequelizeVilla } = require('../database/MySQL.database')
const { db, changeSchema } = require('../models')
const { Sequelize } = require('sequelize')
const { sendEmail } = require('./EmailServices')
const { getLevel } = require('./UserService')
const { getDataProcoopxId } = require('./ProcoopService')
 
      
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

		const dataPeople = await getLevel(user.id, 1)
		user.level = Array.isArray(dataPeople) && dataPeople.length > 0 ? 2 : 1;

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


const logout = async (req, res) => {
    try {
        const id = req.cookies.token.sub
        const user = await db_coopm_v1.UserDesarrollo.findOne({
            where: { id: id },
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const verifyRecoverTokenService = async (token, id_user) => {
    try {
        const user = await db.User.findOne({
            where: { token_temp: token, id: id_user },
        })
        if (!user) throw new Error('El token no existe')
        return user
    } catch (error) {
        throw error
    }
}

const changePasswordService = async (id, password, token) => {
    try {
        const user = await db.User.findOne({
            where: { id: id, token_temp: token },
        })
        const pass = await bcrypt.hash(password, 10)
        user.password = pass
        user.token_temp = null
        await user.save()
        return user
    } catch (error) {
        throw error
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

module.exports = { testConection, login, newQuery, registerUser, authCooptech, generateTokenCooptech, logout, verifyRecoverTokenService , changePasswordService }
