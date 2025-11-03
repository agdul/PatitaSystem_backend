const db = require('../models');
const Linea = db.Linea;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const AppError = require('../utilits/helpers/errors');


class LineaService {

    constructor() {
        this.linea = Linea;
    }

// ---------------------------------------------------------------------------
 //----------------------------CRUD LINEA--------------------------------
// ---------------------------------------------------------------------------
    // Obtener todas las lineas
    async getAll() {

        try {
            return await this.linea.findAll({
                attributes: ['id_linea', 'nombre_linea'],
                include: [{
                    association: 'categorias',
                    attributes: ['id_categoria', 'nombre_categoria']
                },
                { association: 'categorias' }
                ]
            });
        } catch (error) {
            throw new AppError('Error al obtener las líneas', 500);
        }
    };

    //Obtener una linea por nombre
    async getByName(nombre_linea) {
        try {
            const linea = await this.linea.findOne({
                where: {
                    nombre_linea: nombre_linea,
                },
                include: [
                    {
                        association: 'categorias',
                        attributes: ['id_categoria', 'nombre_categoria'],
                    },
                    { association: 'categorias'}
                ]
            });
            return linea;
        }catch (error) {
            throw new AppError('Error al buscar la línea', 500);
        }
    };

    // Crear una nueva linea
    async create(data) {
        const t = await db.sequelize.transaction();
        try {
            const { nombre_linea } = data;  
            //-----------------------------------------------------------
            //-------------- Validaciones -----------------------------
            if (!nombre_linea) {
                throw new AppError('El nombre de la línea es requerido', 400);
            }

            await this.nombreExiste(nombre_linea);  
            //-----------------------------------------------------------
            const nuevaLinea = await this.linea.create(
                { nombre_linea },
                { transaction: t }
            );
            await t.commit();
            return nuevaLinea;
        } catch (error) {
            await t.rollback();
            throw error;
        }   
    };


    // Actualizar una linea
    async update(data) {
        const t = await db.sequelize.transaction();
        try {
            const { id_linea, nombre_linea } = data;  
            //-----------------------------------------------------------
            //-------------- Validaciones -----------------------------
            const exiteLinea = await this.nombreExiste(nombre_linea,id_linea);  
            if (exiteLinea) {
                throw new AppError('El nombre de la línea ya existe', 400);
            }
            //-----------------------------------------------------------
            const lineaActualizada = await this.linea.update(
                { nombre_linea },
                { where: { id_linea }, transaction: t }
            );
            await t.commit();
            return lineaActualizada;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    };

    // Obtener una linea por id
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
    };

    // Eliminar una linea
    async delete(id_linea) {
        const t = await db.sequelize.transaction();
        try {
            const resultado = await this.linea.destroy({
                where: { id_linea },
                transaction: t,
            });
            await t.commit();
            return resultado;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    };

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
    // Logica de negocio 

    async nombreExiste(nombre_linea, id_linea = null) {
        try {
            const whereClause = id_linea
                ? {
                    nombre_linea: nombre_linea,
                    id_linea: { [Op.ne]: id_linea }, // Excluir el actual
                }
                : { nombre_linea: nombre_linea };
            const existente = await this.linea.findOne({ where: whereClause });

            
            if (existente) {
                throw new AppError('El nombre de la línea ya existe', 400);
            }
            return false; // Nombre no existe, está disponible
        } catch (error) {
            console.error('Error en nombreExiste:', error); // <-- Agrega este log
            throw new AppError(`'Error al verificar el nombre de la linea: '${nombre_linea}', ya existe.`, 500, error);    
        }
    };

};

module.exports = LineaService;