const axios = require('axios')
const { debtsCustomerVilla, debtsCustomerVillaAll, debtsCustomerOV } = require('../services/VillaService.js')
const SMB2 = require('smb2');

async function getInvoice(req, res) {
	try {
		const { socios, all } =  req.body;
		const result = [];

		for (const item of socios) {
			const debts = !all ? await debtsCustomerVilla(item.num) : await debtsCustomerVillaAll(item.num);
			if (!debts) {
				continue;
			}
			let invoices = { codigo: item.num, list: [] };

			for (const debt of debts) {

				// console.log(debt);

				let precio = parseFloat(!all ? debt.importe : debt.total) < 0 ? Math.abs(!all ? debt.importe : debt.total) : !all ? debt.importe : debt.total;

				const comp = `${debt.tipoComprobante}${formatearNumero(debt.puntoVenta, 4)}${formatearNumero(debt.numero, 8)}`;
				const pdf = `${debt.tipoComprobante}_${debt.puntoVenta}_${debt.numero}.pdf`;

				// var status
				// if (!all && parseFloat(debt.importe) > 0) {
				var status = 0
				// }
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
					vto: !all ? debt.fechaVencimiento : debt.fecha,
					amount: parseFloat(precio).toFixed(2),
					url: pdf,
					status: status,
					number: debt.cliente,
					nombre: debt.nombre,
					domicilio: debt.domicilio,
					checkbox:  !all && status == 2 ? false : true,
					cuota: debt.cuota
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

const Facturas = (pdf) => {
	return new Promise((resolve, reject) => {
		const smb2Client = new SMB2({
			share: '\\\\10.8.0.13\\pdf',
			domain: 'WORKGROUP',
			username: 'morteros',
			password: 'C00p3m0rt3r0s#'
		});

		smb2Client.readFile(pdf, (err, data) => {
			if (err) {
				if (err.code === 'STATUS_OBJECT_NAME_NOT_FOUND') {
					console.error(`El archivo "${pdf}" no se encontró.`);
					return reject(new Error('Archivo no encontrado'));
				} else {
					console.error('Error al leer el archivo:', err);
					return reject(err);
				}
			}
			resolve(data);
		});
	});
};

const voucherPDF = async (req, res) => {
	try {
	  const { url } = req.body;
  
	  if (!url || !url.endsWith('.pdf')) {
		return res.status(400).send('Nombre de archivo inválido');
	  }
  
	  const pdfData = await Facturas(url);

	  res.setHeader('Content-Type', 'application/pdf');
	  res.send(pdfData);
	} catch (error) {
	  console.error('Error al devolver el PDF');
	  return res.status(404).send('No se pudo obtener el archivo');
	}
  };

// const Facturas = async (pdf) => {
// 	try {
// 	//   const client = new SambaClient({
// 	// 	address: '//10.8.0.13/pdf',
// 	// 	username: 'morteros',
// 	// 	password: 'C00p3m0rt3r0s#',
// 	//   });

// 	const smb2Client = new SMB2({
// 		share: '\\\\10.8.0.13\\pdf',
// 		domain: 'WORKGROUP',
// 		username: 'morteros',
// 		password: 'C00p3m0rt3r0s#'
// 	  });

// 	  pdf = 'FCB_5_100796';
  
// 	  const file = smb2Client.readFile(pdf, (err, data) => {
// 		if (err) {
// 		  if (err.code === 'STATUS_OBJECT_NAME_NOT_FOUND') {
// 			return reject(new Error('Archivo no encontrado'));
// 		  } else {
// 			return reject(err);
// 		  }
// 		} else {
// 		  require('fs').writeFileSync(`./${pdf}`, data);
// 		  console.log(`Archivo "${pdf}" descargado exitosamente.`);
// 		}
// 	  });

// 	  console.log(file);
  
// 	} catch (error) {
// 	  console.error('Error listing files:', error);
// 	  throw error;
// 	}
//   };

module.exports = {
	getInvoice,
	existInvoice,
	Facturas,
	voucherPDF
}
 