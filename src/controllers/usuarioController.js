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
            //data.id_rol = 2; // Asigno rol usuario x defecto

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


    // ---------------------------------------------------------------
    //        *** BUSQUEDA / FILTRADO ***

    /**
        * Mapea a DTO "resumen" para autocompletar/búsquedas rápidas.
     */
    static toResumenDto(u) {
        return {
        id_usuario: u.id_usuario,
        nombre_usuario: u.nombre_usuario,
        apellido_usuario: u.apellido_usuario,
        dni_usuario: u.dni_usuario,
        celular_usuario: u.celular_usuario,
        email_usuario: u.email_usuario,
        usuario: u.usuario
        };
    }

    // ---------------------------------------------------------------
    static async listUsuarios({ q, email, dni, telefono, limit = 20, offset = 0 }) {
        try {
            const query = (q && q.trim().length >= 2) ? q.trim() : null;

            const usuario = await usuarioService.search({
                q: query,
                email: email ? email.trim() : null,
                dni: dni ? dni.trim() : null,
                telefono: telefono ? telefono.trim() : null,
                limit: Math.min(Math.max(parseInt(limit) || 20, 1), 100), // entre 1 y 100
                offset: Math.max(parseInt(offset) || 0, 0)
            })

            return usuario.map(this.toResumenDto);

        } catch (error) {
            throw error;  
        }
    }

    static async getUsuarioByEmail(email) {
        try {
            if (!email || email.trim().length === 0) {
                throw new AppError('Email es requerido', 400);
            }
            const usuario = await UsuarioService.getByEmail(email.trim());
            return usuario;
        } catch (error) {
            throw error;  
        }
    }
}

module.exports = UsuarioController;