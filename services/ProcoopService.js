const { QueryTypes } = require('sequelize')
const { sequelize, SequelizeMorteros } = require('../database/MSSQL.database')
const { db } = require('../models')
const conexionProcoop = async () => {
	try {
		await sequelize.authenticate()
		console.log('CONEXIÓN EXITOSA')
	} catch (error) {
		console.error('ERROR DE MIERDACOOP:', error)
	}
}

const personaPorDni = async (dni) => {
	try {
		const query = `SELECT * FROM personas WHERE NUM_DNI = :dni AND TIP_PERSO = 1`
		const result = await sequelize.query(query, {
			replacements: { dni: dni },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la persona' }
		}
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
		throw error.message
	}
}

const empresaPorCuit = async (cuit) => {
	try {
		const query = `SELECT * FROM personas WHERE NUM_DNI = :cuit AND TIP_PERSO = 2`
		const result = await sequelize.query(query, {
			replacements: { cuit: cuit },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la empresa' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const invoicesXsocio = async (id_procoop) => {
	try {
		const query = `SELECT * FROM facturas WHERE id_procoop = :id_procoop`
		const result = await sequelize.query(query, {
			replacements: { id_procoop: id_procoop },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontraron facturas' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const Persona_x_COD_SOC = async (numberCustomer) => {
	try {
		const query = `SELECT * FROM socios  WHERE cod_soc = :numberCustomer`
		const result = await SequelizeMorteros.query(query, {
			replacements: { numberCustomer: numberCustomer },
			type: QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la persona' }
		}
		const query2 = `SELECT * FROM personas WHERE COD_PER = ${result[0].cod_per}`
		const result2 = await SequelizeMorteros.query(query2, {
			type: QueryTypes.SELECT,
		})
		if (result2.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la persona' }
		}
		return result2
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const ListCityProcoop = async () => {
	try {
		const query = `SELECT * FROM localida`
		const result = await sequelize.query(query, {
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la ciudad' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const ListStateProcoop = async () => {
	try {
		const query = `SELECT * FROM PROVINC`
		const result = await sequelize.query(query, {
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la provincia' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const serviceCustomer = async (data) => {
	try {
		if (data.type !== 'COD_SOC' && data.type !== 'cod_sum') {
			return { error: 'No se encontró la persona' }
		}
		const query = `SELECT s.DES_SER, dss.ID_SERSOC,dss.COD_SER,s.DES_SER,dss.COD_CAT,dss.COD_CATSER,dss.NOMBRE_CATEGORIA,ds.COD_SUM,ds.COD_SOC, ds.DESCRI_SITIVA,
                    ds.NOMBRECALLE AS CALLECUENTA,ds.NUMERO AS ALTURACALLECUENTA,ds.PISO AS PISOCUENTA,ds.DPTO AS DPTOCUENTA,dss.NOMBRECALLE AS CALLESERVICIO,
                    dss.NUMERO AS ALTURACALLESERVICIO,dss.PISO AS PISOSERVICIO,dss.DPTO AS DPTOSERVICIO,dss.FEC_ALTA,dss.FEC_BAJA,dss.ALTA_ADM,dss.BAJA_ADM,dss.[NUM_MED/NUMTEL]
                    FROM Datos_Suministro ds
                    INNER JOIN Datos_ServiciosXSuministro dss ON dss.cod_sum = ds.cod_sum
                    INNER JOIN Servicio s ON s.cod_ser = dss.cod_ser
                    WHERE ds.${data.type} = :number ORDER BY ds.cod_sum`
		const result = await sequelize.query(query, {
			replacements: { number: data.number },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const consumoCustomer = async (data) => {
	try {
		const actualDate = new Date()
		let lastMonth = actualDate.getMonth()
		let lastYear = actualDate.getFullYear() - 1
		if (lastMonth == 0) {
			lastMonth = 12
			lastYear -= 1
		}
		if (lastMonth < 10) {
			lastMonth = `0${lastMonth}`
		}
		const searchSince = `${lastMonth}/01/${lastYear}`
		const query = `SELECT cod_ser, cod_sum, cod_med, fec_act, consumo, periodo, cod_cat,facturado, est_act FROM cons_ser 
    WHERE cod_ser = :ser AND fec_act >= :since AND cod_sum = :account`
		const result = await sequelize.query(query, {
			replacements: { ser: data.ser, since: searchSince, account: data.account },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const debtsCustomer = async (number, all = false) => {
	try {
		const queryString = `SELECT  dd.ID_FAC, dd.COD_COM,  dd.SUC_COM, fa.pagado, dd.NUM_COM, dd.TIPO, dd.FECHA, dd.COD_SOC, dd.COD_PER, dd.COD_SUM,
                  dd.VTO1, dd.TOTAL1, dd.VTO2, dd.TOTAL2, dd.PAGA, dd.FECHASALDO, dd.SALDO, dd.PERIODO, tf.NUMERO, dd.DEB_CRE
                  FROM  pr_mt_nueva_demo.dbo.datos_deuda dd 
                  LEFT JOIN pr_mt_nueva_demo.dbo.talonfac tf ON dd.id_fac = tf.Id_Fac
                  INNER JOIN pr_mt_nueva_demo.dbo.facturas fa ON fa.id_fac = dd.Id_Fac 
                  WHERE dd.cod_soc = :number AND dd.FECHA  >= Dateadd(mm,-13,Getdate()) ${all ? '' : 'AND dd.SALDO != 0'} 
                  ORDER BY FECHA DESC`
		const result = await sequelize.query(query, {
			replacements: { number: number },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const phoneCustomer = async (account) => {
	try {
		const query = `SELECT ID_SERSOC, COD_SUM, COD_SER, COD_CAT, [NUM_MED/NUMTEL]
                  FROM Datos_ServiciosXSuministro WHERE COD_SUM = :account AND cod_ser = 10 AND fec_baja IS NULL`
		const result = await sequelize.query(query, {
			replacements: { account: account },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}
const adheridosSS = async (data) => {
	try {
		const query = `SELECT ad.cod_ser, s.des_ser, ad.cod_sum, ad.cod_soc, ad.fec_alt,
                  ad.fec_baj, d.des_doc, pe.num_dni, ad.cod_per, pe.apellidos, pe.fec_nac, pe.cod_cal, 
                  ca.des_cal, pe.numero, pe.piso, pe.dpto, pe.gru_sgr, pe.fac_sgr, vi.des_vin
                  FROM adhsoc ad
                  LEFT JOIN	personas pe ON ad.cod_per = pe.cod_per 
                  LEFT JOIN	vinculos vi ON ad.cod_vin = vi.cod_vin 
                  LEFT JOIN	calles ca ON pe.cod_cal = ca.cod_cal 
                  LEFT JOIN	document d ON pe.tip_dni = d.cod_doc 
                  LEFT JOIN	servicio s ON ad.cod_ser = s.cod_ser
                  WHERE	ad.cod_sum = :account AND ad.cod_ser IN (:ser1, :ser2) AND fec_baj IS NULL`
		const result = await sequelize.query(query, {
			replacements: { account: data.account, ser1: data.ser[0], ser2: data.ser[1] },
			type: sequelize.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

//Funciones en tablas nuevas en db nueva
const getProcoopMemberxDni = async (dni) => {
	try {
		const user_procoop = await db.Procoop_Member.findOne({ where: { num_dni: dni } })
		return user_procoop.get()
	} catch (error) {
		return { error: error.message }
	}
}
const getDataProcoopxId = async (id) => {
	try {
		const user_procoop = await db.Procoop_Member.findByPk(id)
		return user_procoop.get()
	} catch (error) {
		return { error: error.message }
	}
}
const allAccount = async (id) => {
	try {
		const users_procoop = await db.User_procoopMember.findAll({ where: { id_user: id } })
		return users_procoop.get()
	} catch (error) {
		return { error: error.message }
	}
}

module.exports = {
	personaPorDni,
	empresaPorCuit,
	conexionProcoop,
	invoicesXsocio,
	Persona_x_COD_SOC,
	ListCityProcoop,
	ListStateProcoop,
	serviceCustomer,
	consumoCustomer,
	debtsCustomer,
	phoneCustomer,
	adheridosSS,
	getProcoopMemberxDni,
	getDataProcoopxId,
	allAccount,
}
