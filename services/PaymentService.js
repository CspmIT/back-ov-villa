const { db } = require('../models')

const savePay = async (data, bills) => {
	try {
		const t = await db.sequelize.transaction()
		const pay = await db.Pays.create(data, { transaction: t })
		const details = bills.map((bill) => {
			const comprobante = bill.typeComp + formatearNumero(bill.puntoVenta, 4) + formatearNumero(bill.nrovoucher, 8);
			return {
				id_pay: pay.id,
				description: `Factura ${bill.type}`,
				customer: bill.number,
				name_customer: bill.nombre,
				amount: parseFloat(bill.amount).toFixed(2),
				reference: comprobante
			}
		})
		await db.PaysDetails.bulkCreate(details, { transaction: t })
		await t.commit()
		return pay.id
	} catch (error) {
		throw new Error(error)
	}
}

function formatearNumero(numero, cantidad) {
	return numero.toString().padStart(cantidad, '0');
}

const updatePay = async (data) => {
	try {
	  const t = await db.sequelize.transaction();
  
	  const existingPayment = await db.Pays.findOne({ where: { id: data.id }, transaction: t });
  
	  if (existingPayment) {

		await existingPayment.update(data, { transaction: t });
		await t.commit();
		return existingPayment;
	  } else {

		await t.commit();
		return null; 
	  }
  
	} catch (error) {
	  throw new Error(error);
	}
  };

  async function getPays(id = false) {
		const query = {}
		if (id) {
			query.where = { id }
		}
		return await db.Pays.findAll(query)
	}


	async function getPaysDetails(id_pay = false) {
		const query = {}
		if (id_pay) {
			query.where = { id_pay }
		}
		return await db.PaysDetails.findAll(query)
	}
	

const enabledMethods = async () => {
	const query = {
		where: {
			status: true,
		}, 
	}
	return await db.PaysMethods.findAll(query)
}

const getVouchersCustomer = async (customer) => {
	try {
		try {
			const paymentDetails = await db.PaysDetails.findAll({
				include: {
					model: db.Pays,
					as: 'pays',
					required: true,
					where: {
						id_user: customer,
						status: 1,
					}
				}
			});
	
			return paymentDetails
		} catch (error) {
			throw error;
		}
	} catch (e) {
		console.log(e)
	}
}

module.exports = {
	savePay,
	enabledMethods,
	updatePay,
	getPaysDetails,
	getPays,
	getVouchersCustomer
}
