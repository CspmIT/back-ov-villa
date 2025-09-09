const axios = require('axios')
const { Register, PasswordRecovery } = require('../utils/email/registerEmail')
const { db } = require('../models')
const registerUser = async (data, url) => {
	try {
		const user = await db.User.create(data)

		const urlAthentificate = `${url}/login/${data.token_temp}/${user.id}`
		const emailResponse = await sendEmail(data, urlAthentificate)

		// agregamos la respuesta de sendEmail al objeto que devolvemos
		return { ...data, emailResponse }
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

async function sendEmail(data, url) {
	const html = Register({
		name: `${data.name_register} ${data.last_name_register}`,
		link: url,
	})

	try {
		const response = await axios.post(
			'https://api-dmds-morteros.planisys.net/v1/envio/send_one_inline/',
			{
				campana_id: 14,
				email: true,
				contacto: {
					email: data.email,
					nombre: data.name_register,
					apellido: data.last_name_register,
				},
				html: html,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'e8ba65dc4d01ba6c',
				},
			}
		)

		console.log('Respuesta de envío:', response.data)
		return { success: true, data: response.data }
	} catch (error) {
		console.error('Error al enviar email:', error.response?.data || error.message)
		return {
			success: false,
			error: error.response?.data || error.message,
		}
	}
}

async function sendRecoverPass(name, email, url) {
	try {
		const html = PasswordRecovery({ name, link: url })

		const response = await axios.post(
			'https://api-dmds-morteros.planisys.net/v1/envio/send_one_inline/',
			{
				campana_id: 14,
				email: true,
				contacto: { email, nombre: '', apellido: '' },
				html: html,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'e8ba65dc4d01ba6c',
				},
			}
		)

		console.log('Respuesta de envío:', response.data)
		return { success: true, data: response.data }
	} catch (error) {
		console.error('Error al enviar email:', error.response?.data || error.message)
		return {
			success: false,
			error: error.response?.data || error.message,
		}
	}
}

module.exports = { sendEmail, sendRecoverPass }
