const { Sequelize, QueryTypes } = require('sequelize')
const config = require('../config/config')

const sequelizeCoopm_villa = new Sequelize(
    config.coopm_villa.database,
    config.coopm_villa.username,
    config.coopm_villa.password,
    {
        host: config.coopm_villa.host,
        port: config.coopm_villa.port,
        dialect: config.coopm_villa.dialect,
    }
)

async function testConnection() {
    try {
        await sequelizeCoopm_villa.authenticate()
        await sequelizeCoopm_villa.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

const sequelizeVilla = new Sequelize(
    config.bd_villa.database,
    config.bd_villa.username,
    config.bd_villa.password,
    {
        host: config.bd_villa.host,
        port: config.bd_villa.port,
        dialect: config.bd_villa.dialect,
    }
)

async function testConnectionVilla() {
    try {
        await sequelizeVilla.authenticate()
        await sequelizeVilla.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

const sequelizeCooptech = new Sequelize(
    config.cooptech.database,
    config.cooptech.username,
    config.cooptech.password,
    {
        host: config.cooptech.host,
        port: config.cooptech.port,
        dialect: config.cooptech.dialect,
    }
)

async function testConnectionCooptech() {
    try {
        await sequelizeCooptech.authenticate()
        await sequelizeCooptech.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = {
    QueryTypes,
    sequelizeCoopm_villa,
    testConnection,
    sequelizeVilla,
    testConnectionVilla,
    sequelizeCooptech,
    testConnectionCooptech,
}
