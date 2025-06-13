const { db } = require('../models')

async function getCommentaries(id = false) {
	const query = {
		include: [
			{
				model: db.User,
				as: 'User',
				attributes: ['name_register', 'last_name_register', 'email'],
			},
		],
	}

	if (id) {
		query.where = { id_user: id }
	}

	return await db.Commentary.findAll(query)
}

async function saveCommentary(commentary) {
	return await db.Commentary.create(commentary)
}

async function getPopup(body = false, id = false) {
	const query = {}
	if (id) {
		query.where = { id }
	}else{
		if (body) {
			query.where = { level: body.level, date_end: { [db.Sequelize.Op.gte]: body.date_start }, status: 0}
		}
	}
	return await db.PopUp.findAll(query)
}

async function savePopup(popup) {
	if (popup.id) {
		return await db.PopUp.update(popup, {
			where: { id: popup.id },
		})
	} else {
		return await db.PopUp.create(popup)
	}
}

async function getInformation(id = false) {
	const query = {}
	if (id) {
		query.where = { id }
	}
	return await db.Information.findAll(query)
}

async function saveInformation(information) {
	if (information.id) {
		return await db.Information.update(information, {
			where: { id: information.id },
		})
	} else {
		return await db.Information.create(information)
	}
}

async function getImageInformation(idInformation = false) {
	const query = {}
	if (idInformation) {
		query.where = { id_information: idInformation }
	}
	return await db.Image_Information.findAll(query)
}

async function saveImageInformation(ImageInformation) {
	return await db.Image_Information.create(ImageInformation)
}

async function getClaim(body) {
    const query = {
        order: [['status', 'ASC'], ['id', 'DESC']],
        where: {},
    };

    if (body) {
        if (body.id) {
            query.where.id = body.id;
            return await db.Claim.findAll(query);
        }

        if (body.status && body.status !== '') {
            query.where.status = body.status;
        }

        if (body.inicio && body.inicio !== '') {
            query.where.createdAt = {
                [db.Sequelize.Op.gte]: new Date(body.inicio),
            };
        }

        if (body.fin && body.fin !== '') {
            query.where.createdAt = {
                ...query.where.createdAt,
                [db.Sequelize.Op.lte]: new Date(body.fin),
            };
        }
    }

    return await db.Claim.findAll(query);
}

async function saveClaim(claim) {
	if (claim.id) {
		return await db.Claim.update(claim, {
			where: { id: claim.id },
		})
	} else {
		return await db.Claim.create(claim)
	}
}

async function getUsers(body = false) {
    const query = {
        include: [
            {
                model: db.User_People,
                as: 'User_People',
                attributes: ['level'],
            },
        ],
        where: {},
    };
    if (body) {
        if (body.nivel !== '' && body.nivel !== '1') {
            query.include[0].where = { level: body.nivel };
        }

		if (body.nivel !== '' &&  body.nivel == '1'){
			query.where = { lvl2_date: null };
		}

        if (body.inicio !== '') {
            query.where.createdAt = {
                [db.Sequelize.Op.gte]: new Date(body.inicio),
            };
        }
        if (body.fin !== '') {
            query.where.createdAt = {
                ...query.where.createdAt,
                [db.Sequelize.Op.lte]: new Date(body.fin),
            };
        }
    }

    return await db.User.findAll(query);
}

async function saveMaterialsClaim(materialsClaim) {
    return await db.sequelize.transaction(async (t) => {
		await db.Tools_Claims.destroy({
			where: { id_claim: materialsClaim[0].id_claim },
			transaction: t
		});

		await db.Tools_Claims.bulkCreate(materialsClaim, { transaction: t });
	});
}

async function getMaterialsClaim(idClaim = false) {
	const query = {}
	if (idClaim) {
		query.where = { id_claim: idClaim }
	}
	return await db.Tools_Claims.findAll(query)
}

async function getTools(id = false) {
	const query = {}
	if (id) {
		query.where = { id: id }
	}
	return await db.Tools.findAll(query)
}


async function getActivePopups() {
	return await db.PopUp.findAll({
		where: { status: 1 },
	})
}

async function saveTechniciansClaim(techniciansClaim) {
    return await db.sequelize.transaction(async (t) => {
		await db.Technicians_Claims.destroy({
			where: { id_claim: techniciansClaim[0].id_claim },
			transaction: t
		});

		await db.Technicians_Claims.bulkCreate(techniciansClaim, { transaction: t });
	});
}

async function getTechniciansClaim(idClaim = false) {
	const query = {}
	if (idClaim) {
		query.where = { id_claim: idClaim }
	}
	return await db.Technicians_Claims.findAll(query)
}


async function savePaysMethodEnableds(paysMethodEnableds) {
	return await db.PaysMethodEnableds.create(paysMethodEnableds)
}

async function getPaysMethodEnableds(idMethodEnableds = false) {
	const query = {}
	if (idMethodEnableds) {
		query.where = { id: idMethodEnableds }
	}
	return await db.PaysMethodEnableds.findAll(query)
}

module.exports = {
	getCommentaries,
	saveCommentary,
	getPopup, 
	savePopup, 
	getInformation, 
	saveInformation,
	getImageInformation,
	saveImageInformation, 
	saveClaim,
	getClaim,
	getUsers,
	saveMaterialsClaim,
	getMaterialsClaim,
	getTools,
	getActivePopups,
	saveTechniciansClaim,
	getTechniciansClaim,
	savePaysMethodEnableds,
	getPaysMethodEnableds,
}
