const AuthService = require('../services/AuthService')

const testConect = async (req, res) => {
    try {
        await AuthService.testConection()
        res.json({ message: 'Conexión exitosa' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const token = await AuthService.login(email, password)

        res.json({ token })
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

const newQuery = async (req, res) => {
    try {
        const users = await AuthService.newQuery()
        res.send(users)
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

module.exports = { login, testConect, newQuery }