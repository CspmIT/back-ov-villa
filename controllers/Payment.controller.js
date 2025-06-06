const { enabledMethods, savePay, updatePay, getPaysDetails, getVouchersCustomer} = require('../services/PaymentService')
const { paysCancel} = require('../services/VillaService')

const pkg = require('pluspagos-aes-encryption');

const paymentMethods = async (req, res) => {
	try {
		const result = await enabledMethods()
		return res.status(200).json(result)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

const payLink = async (req, res) => {
	try {
	  const data = req.body;
	  
	  if (!data.bills || data.bills.length === 0) {
		return res.status(400).json({ status: 0, data: 'No se seleccionaron facturas para pagar' });
	  }
	  
	  const pay = {
		id_user: data.usuario.sub,
		name_user: data.usuario.name + " " + data.usuario.lastName,
		total: data.total,
		id_method: 1,
		status: 0,
	  };

	  const id_pay = await savePay(pay, data.bills);
  
	  req.body.id_pay = id_pay;
	  req.body.bills = data.bills;
  
	  const result = await paymentPlusPago(req); 

	  if (!result || !result.status) {
		return res.status(500).json({ message: "Error en el resultado de paymentPlusPago", result });
	  }
  
	  return res.status(result.status == 1 ? 200 : 400).json(result);
  
	} catch (error) {
	  console.error(error);
	  return res.status(400).json({ message: 'Error en el procesamiento del pago', error: error.message });
	}
  };

const paymentPlusPago = async (req, res) => {
	try {
		const payment = req.body;
		const transaction_id = payment.id_pay;

		if (!transaction_id) {
			return { status: 500, message: "Error al crear el pago" };
		}

		const descripcion = [];
		let i = 0;

		if (req.body.bills && Array.isArray(req.body.bills)) {
			req.body.bills.forEach(fac => {
				let monto = parseFloat(fac.amount);

				if (!isNaN(monto)) {
					descripcion[i] = {
					"Importe": monto.toFixed(2).replace(".", ""),
					//   "Barra": fac.id.toString().padStart(8, '0'),
					"concepto": `Factura de ${fac.type} de la Cuenta: ${fac.number}`
				};
				i++;
			} else {
				console.error(`Monto inválido en factura`);
			  }
			});
		} else {
			return { status: 400, message: "No se encontraron facturas" };
		}

		const { total } = payment;

		if (isNaN(total)) {
			return { status: 400, message: "Total inválido" };
		}

		const { encryptString } = pkg

		if (typeof encryptString !== 'function') {
			return { status: 500, message: "Error de función de encriptación" };
		}

		const secret = "CoopdeobrasyservpublicosdeVillaTrinidad_c2f46c88-8f57-4656-814e-593a2b207259"
		const comercio = "f04856d5-9e70-4d07-ab60-0eb1e6719b91"
		const success = "http://localhost:8000/pagoexitoso"
		const failure = "http://localhost:8000/pagofallido"
		const sucursal = ""

		const monto = parseInt(total) * 100
		let montoTotal = monto
		const information = ""
		const data = {
		  success: encryptString(success, secret),
		  failure: encryptString(failure, secret),
		  sucursal: encryptString(sucursal, secret),
		  monto_encrypt: encryptString(montoTotal, secret),
		  monto,
		  info: encryptString(information, secret),
		  descripcion: descripcion,
		  comercio,
		  transaction_id
		}
		return { status: 1, data };
	  } catch (error) {
		console.error(error);
		return { status: 500, message: "Error en el servidor: " + error.message };
	  }
}


//
const paymentStatus = async (req, res) => {
	try {
	  const data = req.body;
	  const dataDb = {
		id: data.TransaccionComercioId,
		status: data.Estado === "REALIZADA" && data.Tipo === "PAGO" ? 1 : 2,
		message: data.Detalle,
		id_external: data.TransaccionPlataformaId,
	  };
  
	  const payment = await updatePay(dataDb);

	  if (payment == null) {
		res.status(404).json({ message: "Pago no encontrado para el transaction_id especificado." });
	  } else {

	const pays = await getPaysDetails(data.TransaccionComercioId) || [];

		const today = new Date();
		const formattedDate = today.toISOString().split('T')[0];

		await Promise.all(
			pays.map(pay => {
				const dataVilla = {
				CompCancelado: pay.reference,
				FechaCobro: formattedDate,
				Procesado: 0,
				CodBanco: 1
				};
				return paysCancel(dataVilla);
			})
		);
		res.status(200).json({ message: "Pago procesado", payment });
	  }

	} catch (e) {
	  res.status(500).json({ message: "Error en el servidor: " + e.message });
	}
  };

  
const voucherCustomer = async (req, res) => {
	try {
		const { customer } = req.query
		const data = await getVouchersCustomer(customer)
		return res.status(200).json(data)
	} catch (e) {
		console.log(e)
	}
}


module.exports = {
	paymentMethods,
	payLink,
	paymentStatus,
	voucherCustomer
}
