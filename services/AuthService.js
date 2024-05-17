const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sequelizeCoopm_v1 } = require('../database/MySQL.database')
const { sequelize, SequelizeOncativo } = require('../database/MSSQL.database')
const { db, db_coopm_v1 } = require('../models')
const { Sequelize } = require('sequelize')
const { sendEmail } = require('./EmailServices')
const { getLevel } = require('./UserService')

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
        iss: 'oficina',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date(remember ? dateYear : dateHour).getTime(),
        NameUser: user.name_register,
        level: user.level,
        TypeUser: user.typePerson,
        darkMode: user.dark
    }
    return jwt.sign(configSing, secret)
}

const login = async (email, password, remember) => {
    // const user = await db_coopm_v1.UserDesarrollo.findOne({ where: { email: email } })
    const user = await db.User.findOne({ where: { email: email } })
    if (!user) {
        throw new Error('El usuario o la contraseña son incorrectas')
    }
    let hash = user.password
    hash = hash.replace(/^\$2y(.+)$/i, '$2a$1')
    const isMatch = await bcrypt.compare(password, hash)
    if (!isMatch) {
        throw new Error('El usuario o la contraseña son incorrectas')
    }
    const dataProcoop = await getLevel(user.id)
    let level = 1
    if (dataProcoop) {
        level = dataProcoop.filter((item) => {
            if (item.primary_account === true) {
                return item.level
            }
        })
    }
    user.level = level
    return signToken(user, remember)
}

const testConection = async () => {
    try {
        await sequelizeCoopm_v1.authenticate()
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
        const user = await db_coopm_v1.UserDesarrollo.findOne({ where: { id: id } })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { testConection, login, newQuery, registerUser, logout }
