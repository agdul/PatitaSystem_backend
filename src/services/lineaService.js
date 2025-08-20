const db = require('../models');
const Linea = db.Linea;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const AppError = require('../utilits/helpers/errors');


class LineaService {
    getById(id_linea) {
        return Linea.findOne({
            where: { id_linea },
            attributes: ['id_linea', 'nombre_linea'],
            include: [
                {
                    association: 'categorias',
                    attributes: ['id_categoria', 'nombre_categoria'],
                },
            ],
        });
    }
}

module.exports = LineaService;