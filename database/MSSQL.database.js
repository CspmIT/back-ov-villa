const { Sequelize } = require('sequelize')
const configDb = require('../config/config')

SequelizeMorteros = new Sequelize(
    configDb.coopm_villa.database,
    configDb.coopm_villa.username,
    configDb.coopm_villa.password,
    {
        host: configDb.coopm_villa.host,
        port: configDb.coopm_villa.port,
        dialect: configDb.coopm_villa.dialect,
        dialectOptions: {
            options: {
                encrypt: false,
            },
        },
    }
)

SequelizeVilla = new Sequelize(
    configDb.bd_villa.database,
    configDb.bd_villa.username,
    configDb.bd_villa.password,
    {
        host: configDb.bd_villa.host,
        port: configDb.bd_villa.port,
        dialect: configDb.bd_villa.dialect,
        dialectOptions: {
            options: {
                encrypt: false,
            },
        },
    }
)

SequelizeCooptech = new Sequelize(
    configDb.cooptech.database,
    configDb.cooptech.username,
    configDb.cooptech.password,
    {
        host: configDb.cooptech.host,
        port: configDb.cooptech.port,
        dialect: configDb.cooptech.dialect,
        dialectOptions: {
            options: {
                encrypt: false,
            },
        },
    }
)

module.exports = {
    SequelizeMorteros,
    SequelizeVilla,
    SequelizeCooptech,
}
