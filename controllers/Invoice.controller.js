const axios = require('axios')
const { debtsCustomerVilla, getPaysCancel, debtsCustomerOV } = require('../services/VillaService.js')
const SambaClient = require('samba-client');

async function getInvoice(req, res) {
	try {
		const { socios, all } =  req.body;
		const result = [];

		// const facturas = await Facturas()
		// console.log(facturas);

		for (const item of socios) {
			const debts = await debtsCustomerVilla(item.num, all);
			if (!debts) {
				continue;
			}

			let invoices = { codigo: item.num, list: [] };

			for (const debt of debts) {
				let precio = parseFloat(debt.importe) < 0 ? Math.abs(debt.importe) : debt.importe;

				const comp = `${debt.tipoComprobante}${formatearNumero(debt.puntoVenta, 4)}${formatearNumero(debt.numero, 8)}`;
				var status
				if (parseFloat(debt.importe) > 0) {
					status = 0
				}
				var isPayed = await debtsCustomerOV(comp)
				status = isPayed ? 2 : status

				let comprobante = '';
				switch (debt.puntoVenta) {
					case 5: comprobante = 'TV';
						break;
					case 9: comprobante = 'INT';
						break;
					case 7: comprobante = 'RA';
						break;
					default:
						break;
				}

				let fact = {
					type: comprobante,
					typeComp: debt.tipoComprobante,
					puntoVenta: debt.puntoVenta,
					nrovoucher: debt.numero,
					vto: debt.fechaVencimiento,
					amount: parseFloat(precio).toFixed(2),
					url: ``,
					status: status,
					number: debt.cliente,
					nombre: debt.nombre,
					domicilio: debt.domicilio,
					checkbox: status == 2 ? false : true
				};

				invoices.list.push(fact);
			}

			if (invoices.list.length > 0) {
				result.push(invoices);
			}
		}
	
		return res.status(200).json(result);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
}

function formatearNumero(numero, cantidad) {
	return numero.toString().padStart(cantidad, '0');
}

async function existInvoice(req, res) { 
	try {
		const { url } = req.query
		const timeout = 5000
		const response = await axios.head(url, { timeout })
		const status = { status: response.status >= 200 && response.status < 300 ? 'existe' : 'falla' }
		const code = status.status === 'existe' ? 200 : 404
		return res.status(code).json(status)
	} catch (error) {
		return res.status(404).json({ status: 'falla' })
	}
}

const Facturas = async () => {
	try {
	  const client = new SambaClient({
		address: '//10.8.0.13/pdf',
		username: 'morteros',
		password: 'C00p3m0rt3r0s#',
	  });

	  console.log(client);
  
	  const files = await new Promise((resolve, reject) => {
		client.list('', (err, files) => {
		  if (err) {
			reject(err);
		  } else {
			resolve(files);
		  }
		});
	  });
  
	  console.log('Files:', files);
	  return files;
  
	} catch (error) {
	  console.error('Error listing files:', error);
	  throw error;
	}
  };

module.exports = {
	getInvoice,
	existInvoice,
	Facturas
}
