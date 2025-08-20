// Handlers, es decir, funciones que manejan las peticiones HTTP.
// En criollo es encargado de recibir el request y enviar la "data" a el controllador en cargado de la logica.

const UsuarioController = require('../controllers/usuarioController');
const AppError = require('../utilits/helpers/errors');

class usuarioController{

//---------------------------------------------------------------
//        *** CRUD ***
    static async getUsuario(req, res){
        try {
            //Desetructuracion de la request para obtener el id del usuario
            const { id } = req.params;
            //Si existe el id, se obtiene un usuario por su id, sino se obtienen todos los usuarios
            const usuario = id ? await UsuarioController.getById(id) : await UsuarioController.getAll();
            res.status(200).json(usuario);
        } catch (error) {
            console.error('❌ Error al obtener el usuario:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };
    static async createUsuario(req, res) {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({ message: 'Datos del usuario son requeridos' });
            }
            const usuario = await UsuarioController.create(data);
            res.status(201).json(usuario);
        } catch (error) {
            console.error('❌ Error al crear el usuario:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };
    static async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ message: 'Datos del usuario son requeridos' });
            }

            const usuario = await UsuarioController.update(id, data);
            res.status(200).json(usuario);
        } catch (error) {
            console.error('❌ Error al actualizar el usuario:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };
    static async deleteUsuario(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return AppError('ID del usuario es requerido', 400);
            }
            const usuarioEliminado = await UsuarioController.delete(id);
            res.status(200).json({
            mensaje: 'Usuario eliminado correctamente',
            usuario: usuarioEliminado
        });
        } catch (error) {
            console.error('❌ Error al eliminar el usuario:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };
};

//---------------------------------------------------------------
module.exports = usuarioController;