const { getCommentaries, saveCommentary, savePopup, getPopup, saveInformation, getInformation, getImageInformation, saveImageInformation, 
	getClaim, saveClaim, getUsers, saveMaterialsClaim, getMaterialsClaim, getTools, getActivePopups, saveTechniciansClaim, 
	getTechniciansClaim, getPaysMethodEnableds, savePaysMethodEnableds} = require('../services/ManagmentService')

async function Commentaries(req, res) {
	try {
		const commentaries = await getCommentaries()
		res.status(200).json(commentaries)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addCommentary(req, res) {
	try {
		const commentary = req.body
		const {id} = req.user;
		commentary.id_user = id;
		const newCommentary = await saveCommentary(commentary)
		res.status(200).json(newCommentary)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addPopup(req, res) {
	try {
		const popup = req.body
		const existePopup = await getPopup(popup)
		if(existePopup.length > 0){
			res.status(200).json(['existeModal'])
		}
		const newPopup = await savePopup(popup)
		res.status(200).json(newPopup)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function Popups(req, res) {
	try {
		const id = req.query.id || false
		const popups = await getPopup(false, id)
		res.status(200).json(popups)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addInformation(req, res) {
	try {
		const information = req.body
		const newInformation = await saveInformation(information)
		res.status(200).json(newInformation)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function Informations(req, res) {
	try {
		const id = req.query.id || false
		const informations = await getInformation(id)
		res.status(200).json(informations)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addImageInformation(req, res) {
	try {
		const Imagesinformations = req.body
		const newImageInformation = await saveImageInformation(Imagesinformations)
		res.status(200).json(newImageInformation)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function ImageInformations(req, res) {
	try {
		const idInformation = req.query.idInformation || false
		const Imagesinformations = await getImageInformation(idInformation)
		res.status(200).json(Imagesinformations)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addClaim(req, res) {
	try {
		const claim = req.body
		const newClaim = await saveClaim(claim)
		res.status(200).json(newClaim)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function Claims(req, res) {
	try {
		const datos = req.body
		const claims = await getClaim(datos)
		res.status(200).json(claims)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function Users(req, res) {
	try {
		const datos = req.body
		const users = await getUsers(datos)
		res.status(200).json(users)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function MaterialsClaim(req, res) {
	try {
		const idClaim = req.query.id_claim || false
		const MaterialsClaim = await getMaterialsClaim(idClaim)
		res.status(200).json(MaterialsClaim)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addMaterialsClaim(req, res) {
	try {
		const MaterialsClaim = req.body
		const newMaterialsClaim = await saveMaterialsClaim(MaterialsClaim)
		res.status(200).json(newMaterialsClaim)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function toolsClaim(req, res) {
	try {
		const id = req.query.id || false
		const tools = await getTools(id)
		res.status(200).json(tools)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function activePopups(req, res) {
	try {
		const id = req.query.id || false
		const popups = await getActivePopups()
		res.status(200).json(popups)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function TechnicianClaim(req, res) {
	try {
		const idClaim = req.query.id_claim || false
		const TechniciansClaim = await getTechniciansClaim(idClaim)
		res.status(200).json(TechniciansClaim)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function addTechnicianClaim(req, res) {
	try {
		const TechniciansClaim = req.body
		const newTechniciansClaim = await saveTechniciansClaim(TechniciansClaim)
		res.status(200).json(newTechniciansClaim)
	} catch (error) {
		res.status(400).json(error.message)
	}
} 

async function addMethodEnableds(req, res) {
	try {
		const methodEnableds = req.body
		const newMethodEnableds = await savePaysMethodEnableds(methodEnableds)
		res.status(200).json(newMethodEnableds)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

async function methodEnableds(req, res) {
	try {
		const id = req.query.id || false
		const methodEnableds = await getPaysMethodEnableds(id)
		res.status(200).json(methodEnableds)
	} catch (error) {
		res.status(400).json(error.message)
	}
}

module.exports = {
	Commentaries,
	addCommentary,
	addPopup,
	Popups, 
	Informations, 
	addInformation, 
	ImageInformations,
	addImageInformation, 
	Claims, 
	addClaim, 
	addMaterialsClaim,
	MaterialsClaim,
	Users,
	toolsClaim,
	activePopups,
	TechnicianClaim,
	addTechnicianClaim,
	addMethodEnableds,
	methodEnableds
}
