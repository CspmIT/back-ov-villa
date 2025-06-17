require('dotenv').config()

module.exports = {
    coopm_villa: {
        database: 'ov_villa_trinidad',
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
    },
    bd_villa: {
        database: 'gv6-coopserviciosvt',
        username: 'morteros',
        password: 'Soporteit!.',
        host: '10.8.0.13',
        port: 3306,
        dialect: 'mysql',
    },
    cooptech: {
        database: 'cooptech',
        username: 'reconecta',
        password: 'PgHQGFEgMEfsuEKfB6tV',
        host: '172.26.5.100',
        port: 3306,
        dialect: 'mysql',
    },
}
