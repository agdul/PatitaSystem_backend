const UsuarioService = require('../services/usuarioService');
const usuarioService = new UsuarioService();
const AppError = require('../utilits/helpers/errors');
const { hashPassword, matchPassword } = require('../security/hashPass');

class  UsuarioController{
    static async getAll() {
        try {
            const usuarios = await usuarioService.getAll();
            if (!usuarios || usuarios.length === 0) {
                throw new Error('No se encontraron usuarios', 404);
            }
            return usuarios;
        } catch (error) {
            throw error;
        }
    };
    static async getById(id_usuario) {
        try {
            const usuario = await usuarioService.getById(id_usuario);
            return usuario;
        } catch (error) {
            throw error;
        }
    };
    static async create(data) {
        try {
            const password = data.password;
            // hasheo la contraseña
            //console.log('Contraseña antes de hashear:', password);
            if (password) {
                data.password = await hashPassword(data.password);
            }
            data.id_rol = 2; // Asigno rol usuario x defecto

            //console.log('Contraseña después de hashear:', data.password);
            //await this.existeByNombre(nombre_usuario);
            //await usuarioService.verificarUsuarioActivo(data.id_usuario);
            const usuario = await usuarioService.create(data);
            return usuario;
        } catch (error) {
            throw error;
        }
    };
    static async update(id, data) {
        try {
            // Validaciones personalizadas
            // await usuarioService.existeByDniEdit(data.dni_usuario, id);
            // await usuarioService.existeByDniEdit(data.email_usuario, id);
    
            // Obtener el usuario actual para comparar la contraseña
            const usuarioActual = await usuarioService.getById(id);
    
            // Si hay una nueva contraseña, compararla con la actual
            if (data.password) {
                const esMisma = await matchPassword(data.password, usuarioActual.password);
                if (!esMisma) {
                    data.password = await hashPassword(data.password);
                } else {
                    delete data.password; // No rehashear si es la misma
                }
            } else {
                delete data.password; // No se quiso cambiar
            }
    
            // Actualizar
            const usuario = await usuarioService.update(id, data);
            return usuario;
        } catch (error) {
            throw error;
        }
    };
    static async delete(id) {
        try {
            const usuario = await usuarioService.delete(id);
            return usuario;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = UsuarioController;