const { enabledMethods, savePay, getPaysFromDate, updatePay, getPaysDetails, getVouchersCustomer} = require('../services/PaymentService')
const { paysCancel} = require('../services/VillaService')
const { db } = require('../models')
const axios = require('axios')

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
		const success = "https://cspvilla.cooptech.com.ar/pagoexitoso"
		const failure = "https://cspvilla.cooptech.com.ar/pagofallido"
		const sucursal = ""

		const monto = total.toFixed(2).replace(".", "");
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
		// Solo si el pago fue REALIZADO
		if (dataDb.status === 1) {
		  const pays = await getPaysDetails(data.TransaccionComercioId) || [];
		  const today = new Date();
		  const formattedDate = today.toISOString().split('T')[0];
  
		  await Promise.all(
			pays.map(pay => {
			  const dataVilla = {
				CompCancelado: pay.reference.toUpperCase(),
				FechaCobro: formattedDate,
				Procesado: 0,
				CodBanco: 1,
				cuota:  pay.cuota
			  };
			  return paysCancel(dataVilla);
			})
		  );
		}
  
		res.status(200).json({ message: "Pago procesado", payment });
	  }
	} catch (e) {
	  res.status(500).json({ message: "Error en el servidor: " + e.message });
	}
  };


  const paymentStatusActual = async (req, res) => {
	try {
  
		const payments = await getPaysFromDate();  
		if (!payments || payments.length === 0) {
			return res.status(404).json({ message: "No hay pagos" });
		}

		const today = new Date();
		const formattedDate = today.toISOString().split("T")[0];

		await Promise.all(
			payments.map(async (payment) => {
			  // recorremos sus detalles
			  await Promise.all(
				payment.details.map((payDetail) => {
				  const dataVilla = {
					CompCancelado: payDetail.reference.toUpperCase(),
					FechaCobro: formattedDate,
					Procesado: 0,
					CodBanco: 1,
					cuota: payDetail.cuota,
				  };
				  return paysCancel(dataVilla);
				})
			  );
			})
		  );

		  res.status(200).json({
			message: "Pagos procesados correctamente",
			count: payments.length,
		  });

	} catch (e) {
	  res.status(500).json({ message: "Error en el servidor: " + e.message });
	}
  };
  
	// Obtiene el token Bearer de PlusPagos (equivalente a session() del sistema Macro)
	const getToken = async () => {
		const payload = {
			guid: "f04856d5-9e70-4d07-ab60-0eb1e6719b91",
			frase: "jTh0q96eNc8d3H7y0n/Mpze9Y8QJ8hURgpAG8ec6CGA=",
		};
		const { data } = await axios.post(
			"https://botonpp.asjservicios.com.ar:8082/v1/sesion",
			payload,
			{ headers: { "Content-Type": "application/json" } }
		);
		return data.data; 
	};

	const reconcileTransactions = async (req, res) => {
		try {

			const token = await getToken();

			const pad = (n) => String(n).padStart(2, "0");
			const fmt = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
			const ayer = new Date();
			ayer.setDate(ayer.getDate() - 1);
			const anteayer = new Date();
			anteayer.setDate(anteayer.getDate() - 2);

			const { data: result } = await axios.get(
				"https://botonpp.asjservicios.com.ar:8082/v1/transactions",
				{
					params: {
						FechaDesde: fmt(anteayer),
						FechaHasta: fmt(ayer),
						EstadoTransaccion: 3,
					},
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const transacciones = result?.data?.transacciones || [];

			// Traemos los pagos locales para saber su estado en NUESTRA base
			const ids = transacciones.map((t) => t.transaccionComercioId);
			const pays = ids.length
				? await db.Pays.findAll({ where: { id: ids } })
				: [];
			const paysById = new Map(pays.map((p) => [String(p.id), p]));

			const procesadas = [];
			const today = new Date();
			const formattedDate = today.toISOString().split("T")[0];

			for (const transaccion of transacciones) {
				const id = transaccion.transaccionComercioId;

				// Solo miramos nuestra base: si el pago ya esta confirmado, no hacemos nada
				const payLocal = paysById.get(String(id));
				if (payLocal && payLocal.status === 1) continue;

				// Necesitamos el detalle del pago para poder cancelarlo
				const detalles = (await getPaysDetails(id)) || [];
				if (detalles.length === 0) continue; // no existe en nuestra base, nada que procesar

				// Esta pagado en la transaccion y NO confirmado en nuestra base -> proceso completo
				const payActualizado = await updatePay({
					id,
					status: 1,
					message: (transaccion.detalle || "") + " - Omitido por webhook",
					id_external: null,
				});

				const comprobantes = detalles.map((det) => det.reference.toUpperCase());

				await Promise.all(
					detalles.map((det) =>
						paysCancel({
							CompCancelado: det.reference.toUpperCase(),
							FechaCobro: formattedDate,
							Procesado: 0,
							CodBanco: 1,
							cuota: det.cuota,
						})
					)
				);

				procesadas.push({
					id,
					monto: transaccion.monto,
					fecha: transaccion.fecha,
					pago: payActualizado,
					comprobantes,
				});
			}

			return res.status(200).json({
				message: "Reconciliacion finalizada",
				revisadas: transacciones.length,
				totalProcesadas: procesadas.length,
				procesadas,
			});
		} catch (e) {
			return res.status(500).json({ message: "Error en el servidor: " + e.message });
		}
	};

	async function voucherCustomer(req, res) {
		try {
			const { socios } =  req.body;
			const result = [];

			for (const item of socios) {
				const data = await getVouchersCustomer(item.num)
				if (!data) {
					continue;
				}
				let pays = { codigo: item.num, list: data ?? [] };

				if (pays.list.length > 0) {
					result.push(pays);
				}
			}
		
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}

module.exports = {
	paymentMethods,
	payLink,
	paymentStatus,
	voucherCustomer,
	paymentStatusActual,
	reconcileTransactions
}
  