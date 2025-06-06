const { QueryTypes,  Op, col } = require('sequelize')
const { SequelizeVilla } = require('../database/MSSQL.database')
const { db } = require('../models')

const Cliente_x_code = async (numberCustomer) => {
	try {
		if (!numberCustomer) throw new Error('falta pasar el numero de socio')
		// const user = await db.Person.findOne({ where: { number_customer: numberCustomer }, include: [{ association: 'Person_physical' }, { association: 'Person_legal' }] })
		// if (user) return user.get()
		const query = `SELECT * FROM clientes WHERE codigo = :numberCustomer AND inactivo = 0`
		const result = await SequelizeVilla.query(query, {
			replacements: { numberCustomer: numberCustomer },
			type: QueryTypes.SELECT,
		})
		if (result.length === 0) {
			throw new Error('No se encontro socio o esta Inactivo')
		}
		return result
	} catch (error) {
		throw error
	}
}

const Service_x_code = async (numberCustomer) => {
	try {
		if (!numberCustomer) throw new Error('falta pasar el numero de socio')
		const query = `SELECT * FROM clientes WHERE codigo = :numberCustomer AND inactivo = 0`
		const result = await SequelizeVilla.query(query, {
			replacements: { numberCustomer: numberCustomer },
			type: QueryTypes.SELECT,
		})
		if (result.length === 0) {
			throw new Error('No se encontro socio o esta Inactivo')
		}
		return result
	} catch (error) {
		throw error
	}
}

const debtsCustomerVilla = async (number, all) => {
	try {
		const query = `SELECT v.*, c.nombre, c.domicilio FROM vencimientoscobrar as v 
					   LEFT JOIN clientes as c on c.codigo = v.cliente  
                       WHERE v.cliente = :number ${all ? '' : 'AND v.importe > 0'} AND c.inactivo = 0 
					   AND (v.puntoVenta = 5 OR v.puntoVenta = 9 OR v.puntoVenta = 7) 
                       ORDER BY v.fechaComprobante DESC`;

		const result = await SequelizeVilla.query(query, {
			replacements: { number: number },
			type: SequelizeVilla.QueryTypes.SELECT,
		});

		return result;
	} catch (error) {
		throw error;
	}
};

const getPaysCancel = async (CompCancelado) => {
	try {
		const query = `select * from oficinav where CompCancelado = :CompCancelado`;

		const result = await SequelizeVilla.query(query, {
			replacements: { CompCancelado: CompCancelado },
			type: SequelizeVilla.QueryTypes.SELECT,
		});

		return result;
	} catch (error) {
		throw error;
	}
};

const debtsCustomerOV = async (number) => {
	try {
		const paymentDetails = await db.PaysDetails.findAll({
			where: {
				reference: number,
			},
			include: {
				model: db.Pays,
				as: 'pays',
				required: true,
				where: {
					status: 1
				}
			}
		});

		return paymentDetails.length > 0
	} catch (error) {
		throw error;
	}
};

const paysCancel = async (data) => {
	try {
		const query = `
			INSERT INTO oficinav 
			(CompCancelado, FechaCobro, Procesado, CodBanco) 
			VALUES (:CompCancelado, :FechaCobro, :Procesado, :CodBanco)
		`;
		const result = await SequelizeVilla.query(query, {
			replacements: {
				CompCancelado: data.CompCancelado,
				FechaCobro: data.FechaCobro,
				Procesado: data.Procesado,
				CodBanco: data.CodBanco
			},
			type: SequelizeVilla.QueryTypes.INSERT, 
		});


		return result;
	} catch (error) {
		throw error;
	}
};



const getOrCreateMember = async (body, user) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const { name_customer, last_name_customer, num_customer, type_person } = body
			let Personvilla = await db.Person.findOne({ where: { number_customer: num_customer }, transaction: t })
			if (!Personvilla) {
				const datoUser = await Cliente_x_code(num_customer)
				if (!datoUser) throw new Error('El numero de socio no es correcto')
				let dataVilla = datoUser[0]
				const dni = dataVilla?.numeroDocumento;
				const dniGuardar =  dni.replace(/\./g, '');
				// SE GENERA UN OBJETO DONDE TENGA TODO LOS VALORES DE PROCOOP, PARA QUE EN CASO DE QUE NO EXISTA CREARLO
				const dataVillaMember = {
					procoop_last_name: dataVilla.nombre,
					email: dataVilla.email,
					number_customer: num_customer,
					type_person: type_person,
					situation_tax: null,
					type_document: dataVilla.tipoDocumento,
					number_document: dniGuardar,
				}

				// SE CREA LA PERSONA CON LOS DATOS DE PROCOOP
				const [PersonvillaControl, createdPerson] = await db.Person.findOrCreate({ where: { number_document: dniGuardar }, defaults: { ...dataVillaMember }, transaction: t })
				if (!createdPerson) {
					const dataUpdatePerson = {
						procoop_last_name: dataVilla.nombre,
						number_customer: num_customer,
						situation_tax: null,
					}
					await PersonvillaControl.update(dataUpdatePerson, { transaction: t })
				}
				// DEPENDIENDO DEL TIPO DE PERSONA SE GENERA UN OBJETO CON SUS DATOS Y SE GUARDA EL REGISTRO DE ESA PERSONA.
				// 1 ES PERSONA FISICA, 2 PERSONA LEGAL
				if (type_person === 1) {
					const dataPersonPhysicalVilla = {
						name: name_customer,
						last_name: last_name_customer,
						type_dni: dataVilla.tipoDocumento,
						num_dni: dniGuardar,
						born_date: new Date(`${dataVilla.fechaNacimiento} `),
						id_type_sex: dataVilla.SEXO === 'M' ? 2 : 1,
						id_person: PersonvillaControl.id,
					}
					// SE CREA LA PERSONA FISICA DE PERSONA DE PROCOOP
					await db.Person_physical.findOrCreate({ where: { num_dni: dniGuardar }, defaults: { ...dataPersonPhysicalVilla }, transaction: t })
				} else {
					const dataPersonLegalVilla = {
						social_raeson: name_customer,
						fantasy_name: last_name_customer,
						cuit: dniGuardar,
						date_registration: new Date(`${dataVilla.fechaNacimiento} `),
						id_person: PersonvillaControl.id,
					}
					// SE CREA LA PERSONA LEGAL DE PERSONA DE PROCOOP
					const [dataPersonLegal, createdLegal] = await db.Person_legal.findOrCreate({ where: { cuit: dataPersonLegalVilla.cuit }, defaults: { ...dataPersonLegalVilla }, transaction: t })
					if (!createdLegal) {
						const dataUpdate = {
							social_raeson: dataPersonLegal.social_raeson || dataPersonLegalVilla.social_raeson,
							fantasy_name: dataPersonLegal.fantasy_name || dataPersonLegalVilla.fantasy_name,
						}
						await dataPersonLegal.update(dataUpdate, { transaction: t })
					}
				}
				Personvilla = PersonvillaControl
			}
			// SE CREA UN OBJETO PARA LA RELACION DE PERSON Y USER EN LA TABLA DE USER_PEOPLE
			const relationPersonvilla = {
				id_person: Personvilla.id,
				id_user: user.id,
				level: 2,
				primary_account: false,
				status: true,
			}
			// SE BUSCA Y CREA UN REGISTRO DE USER_PEOPLE SEGUN EL ID DEL USUARIO
			const [relationProcoop, create] = await db.User_People.findOrCreate({ where: { id_user: user.id, id_person: Personvilla.id }, defaults: { ...relationPersonvilla }, transaction: t })
			// EN CASO DE QUE SE ENCUENTRE UN REGISTRO CON ESOS VALORES SE ACTUALIZA EL REGISTRO
			if (!create) await relationProcoop.update(relationPersonvilla, { transaction: t })

			const dataResult = {
				id_relation: relationProcoop.id,
				name: Personvilla.procoop_last_name,
				num: Personvilla.number_customer,
				primary: relationProcoop.primary_account,
				level: relationProcoop.level,
			}
			return dataResult
		} catch (error) {
			throw error
		}
	})
}


module.exports = {
	Cliente_x_code,
	debtsCustomerVilla,
	debtsCustomerOV,
	getOrCreateMember,
	Service_x_code,
	paysCancel,
	getPaysCancel
}