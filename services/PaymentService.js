const axios = require('axios')
const { db } = require('../models')
const { Preference, default: MercadoPagoConfig } = require('mercadopago')

const savePay = async (data, bills) => {
	try {
		const t = await db.sequelize.transaction()
		const pay = await db.Pays.create(data, { transaction: t })
		const details = bills.map((bill) => {
			return {
				id_pay: pay.id,
				description: `Factura ${bill.type} - Periodo ${bill.period}`,
				account: bill.account,
				amount: parseFloat(bill.amount).toFixed(2),
				reference: bill.nrovoucher,
				ss: bill.type.includes('SS') ? 1 : 0,
			}
		})
		await db.PaysDetails.bulkCreate(details, { transaction: t })
		await t.commit()
		return pay.id
	} catch (error) {
		throw new Error(error)
	}
}

const enabledMethods = async () => {
	const query = {
		include: [
			{
				model: db.PaysMethods,
				attributes: ['name', 'logo'],
			},
		],
		where: {
			status: true,
		},
	}
	return await db.PaysMethodEnabled.findAll(query)
}

const payFunCheckout = async (data) => {
	try {
		const paydata = JSON.stringify({
			currency_id: 'ARS',
			external_transaction_id: data.external_id,
			due_date: data.due_date,
			source: {
				type: 'web',
				id: '000001',
				name: 'Oficina Virtual',
			},
			return_url: 'https://payfun.com.ar',
			back_url: 'https://payfun.com.ar',
			notification_url: 'https://desarrollo.coopmorteros.coop/Testjuan/payfun',
			details: data.details,
			payer: {
				name: data.name,
				email: data.mail,
				identification: {
					type: 'DNI_ARG',
					number: data.dni,
					country: 'ARG',
				},
			},
		})

		var config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: 'https://checkouts.payfun.com.ar/v2/checkout',
			headers: {
				'x-api-key': 'MGRjOTY3ZjI0OTg1YTQxYjliNzY3OTBkNDIzYjc1YTJhZDk0NWFiN2Y5ZmRiMjA5',
				'x-access-token': 'MTAyNjc5YWY3YzRmNjQwZjI0OWI4YzYyMmI5ZDMxMDM0YzU4NTU3ZjJhNmE4YTEw',
				'Cache-Control': 'no-cache',
				'Content-Type': 'application/json',
			},
			data: paydata,
		}
		const result = await axios(config)
			.then(function (response) {
				return { status: 1, url: response.data.form_url }
			})
			.catch(function (error) {
				return { status: 0, data: error.response.data.error }
			})
		return result
	} catch (error) {
		throw new Error(error)
	}
}

const MercadoPagoPreference = async (payment) => {
	const client = new MercadoPagoConfig({ accessToken: 'TEST-3245352482209602-041711-ac091a20ba5186ef2227ea8675f25eae-1775560306' })
	const preference = new Preference(client)
	const data = await preference
		.create({
			body: {
				items: [
					{
						title: payment.description,
						quantity: 1,
						unit_price: payment.amount,
					},
				],
				external_reference: payment.external_reference,
				auto_return: 'approved',
				back_urls: {
					success: 'https://desarrollo.coopmorteros.coop/Testjuan/mercadopago',
					failure: 'https://desarrollo.coopmorteros.coop/Testjuan/mercadopago',
					pending: 'https://desarrollo.coopmorteros.coop/Testjuan/mercadopago',
				},
			},
		})
		.then((response) => {
			return { status: 1, url: response.id }
		})
		.catch((error) => {
			return { status: 0, data: error.message }
		})

	return data
}

module.exports = {
	savePay,
	enabledMethods,
	payFunCheckout,
	MercadoPagoPreference,
}
