const { authCooptech, generateTokenCooptech } = require('../services/AuthService')
const { addUserCooptech, ProductsCliente_x_id, MethodsPays } = require('../services/CooptechServices')

async function relationUserCooptech(req, res) {
	try {
		const { name, last_name, dni, email, token, profile } = req.body
		if (!name && !last_name && !dni && !email && !token && !profile) throw new Error('se deben pasar todo los campos (nombre, apellido, dni, email y token)')
		const result = await addUserCooptech(req.body)
		return res.status(200).json(result)
	} catch (error) {
		if (error.errors) {
			res.status(500).json(error.errors)
		} else {
			res.status(400).json(error.message)
		}
	}
}
const loginCooptech = async (req, res) => {
	try {
		const { email, tokenCooptech, schemaName } = req.body
		const token = await authCooptech(email, tokenCooptech, schemaName)
		return res.status(200).json({ token })
	} catch (error) {
		if (error.errors) {
			res.status(500).json(error.errors)
		} else {
			res.status(400).json(error.message)
		}
	}
}
const tokenCooptech = async (req, res) => {
	try {
		const { email, tokenCooptech, schemaName } = req.body
		const token = await generateTokenCooptech(email, tokenCooptech, schemaName)
		return res.status(200).json({ token })
	} catch (error) {
		if (error.errors) {
			res.status(500).json(error.errors)
		} else {
			res.status(400).json(error.message)
		}
	}
}

const OVCliente = async (req, res) => {
	try {
	  const { id } = req.params;
	  const cliente = await ProductsCliente_x_id(id);
	  return res.status(200).json(cliente);
	} catch (error) {
	  if (error.errors) {
		res.status(500).json(error.errors);
	  } else {
		res.status(400).json(error.message);
	  }
	}
  };

  const Methods = async (req, res) => {
	try {
	  const id = req.query.id || false
	  const cliente = await MethodsPays(id);
	  return res.status(200).json(cliente);
	} catch (error) {
	  if (error.errors) {
		res.status(500).json(error.errors);
	  } else {
		res.status(400).json(error.message);
	  }
	}
  }; 


module.exports = {
	relationUserCooptech,
	loginCooptech,
	tokenCooptech,  
	OVCliente, 
	Methods
}
