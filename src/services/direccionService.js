const db = require("../models");
const Direccion = db.Direccion;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const AppError = require('../utilits/helpers/errors');


class DireccionService {
// ---------------------------------------------------------------
//      *** Constructor ***
    constructor() {
        this.direccion = Direccion;
    }
// ---------------------------------------------------------------

// ---------------------------------------------------------------
//      *** CRUD - Direccion ***
    // Obtener todas las direcciones
    async getAll() {
        return await this.direccion.findAll({
            attributes: { exclude: ['id_localidad'] },
            include: [{
                association: "localidad",
                attributes: { exclude: ['id_provincia'] },
                include: [{ 
                    association: "provincia"
                }]
            }]
        });
    };

    // Obtener una direccion por id
    async getById(id_direccion) {
        const direccion = await this.direccion.findOne({
            where: { id_direccion: id_direccion },
            attributes: { exclude: ['id_localidad'] },
            include: [{
                association: "localidad",
                attributes: { exclude: ['id_localidad','id_provincia'] },
                include: [{
                    association: "provincia",
                    attributes: { exclude: ['id_provincia'] }
                }]
            }]
        });
        return direccion;
    };

    // Crear una direccion dentro de una transacción
    async create(data) {
        const t = await db.sequelize.transaction(); // Crear transacción
        try {
            // -------Validaciones----------------------


            // ------------------------------------------
            // ------------------------------------------
            // Realizar la creación dentro de la transacción
            const nuevaDireccion = await this.direccion.create(data, { transaction: t });
            await t.commit();
            return nuevaDireccion;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    };

    async update(id, data) {
        const t = await db.sequelize.transaction(); // Crear transacción
        try {
            // -------Validaciones----------------------

            // ------------------------------------------

            const [updateDireccion] = await this.direccion.update(data, {
                where: { id_direccion: id },
                transaction: t
            });

            if (updateDireccion === 0) {
                throw new AppError("No se pudo actualizar la dirección", 400);
            }
            const direccionActualizada = await this.direccion.findByPk(id, { transaction: t });
            await t.commit();
            return direccionActualizada;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    };

    async delete(id) {
        const t = await db.sequelize.transaction();
        try {
            const direccion = await this.direccion.findByPk(id);
            if (!direccion) {
                throw new AppError("Dirección no encontrada", 404);
            }
            await this.direccion.destroy({ where: { id_direccion: id }, transaction: t });
            await t.commit();
            return direccion;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    };

// ---------------------------------------------------------------




//---------------------------------------------------------------
//     ***Funciones - Auxiliares - Direccion ***
//---------------------------------------------------------------



};

module.exports = new DireccionService();