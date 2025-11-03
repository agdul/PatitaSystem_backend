const db = require('../models');
const Usuario = db.Usuario;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const AppError = require('../utilits/helpers/errors');

class UsuarioService {

  ciLike(field, text) {
  // podés ajustar el tamaño si querés: NVARCHAR(255), NVARCHAR(100)
  const casted = Sequelize.cast(Sequelize.col(field), 'NVARCHAR(4000)');
  return Sequelize.where(Sequelize.fn('LOWER', casted), { [Op.like]: text.toLowerCase() });
}

    constructor() {
        this.usuario = Usuario;
    }
//----------------------------------------------------------------
    // Obtener todos los usuarios
    async getAll() {
        return await this.usuario.findAll({
            attributes: { exclude: ['id_rol', 'id_genero', 'id_direccion'] },
            include: [
                { association: "rol" },
                { association: "genero" },
                { association: "direccion",
                    attributes: { exclude: ['id_localidad'] },
                    include: [{
                            association: "localidad",
                            attributes: { exclude: ['id_provincia'] },
                            include: [{ 
                                    association: "provincia" 
                            }]
                    }]
                 }]
        });
    };
    // Obtener un usuario por id
    async getById(id_usuario) {
        const usario = await this.usuario.findOne({
            where: { id_usuario: id_usuario },
            attributes: { exclude: ['id_rol', 'id_genero', 'id_direccion'] },
            include: [
                { association: "rol" },
                { association: "genero" },
                { association: "direccion",
                    attributes: { exclude: ['id_localidad'] },
                    include: [{
                            association: "localidad",
                            attributes: { exclude: ['id_provincia'] },
                            include: [{ 
                                    association: "provincia" 
                            }]
                    }]
                 }]
        });

        if (!usario || usario.length === 0) {
            throw new AppError("Usuario no encontrado", 404);
        }
        return usario;
    };
    // Crear un usuario dentro de una transacción
    async create(data) {
        const t = await db.sequelize.transaction(); // Crear transacción
        try {
            //-------Validaciones----------------------
            await this.existeByEmail(data.email_usuario);      // email único
            await this.existeByUsuario(data.usuario);          // username único
            await this.existeByDni(data.dni_usuario);          // dni único
            //--------------------------------------------
            // Validar genero exista 
            //await this.existeGenero(data.id_genero);
            // Validar rol exista
            //await this.existeRol(data.id_rol);
            // Validad Direccion
            //await this.existeDireccion(data.id_direccion);


            //--------------------------------------------
            // Realizar la operación dentro de la transacción
            const usuario = await this.usuario.create(data, { transaction: t });
            // Si todo va bien, hacer commit
            await t.commit();
            return usuario;
        } catch (error) {
            // Si ocurre un error, hacer rollback
            await t.rollback();
            throw error; // Lanzar el error para ser manejado por quien llame a este servicio
        }
    };
    // Actualizar un usuario dentro de una transacción
    async update(id, data) {
        // VER VALIDACIONES
        const t = await db.sequelize.transaction();
        try {
            //----------Validaciones ---------------------------------
            const dniExistente = await this.existeByDniEdit(data.dni_usuario, id);
            if (dniExistente) {
                throw new AppError("El DNI ya está en uso por otro usuario", 400);
            }
    
            const usuarioExistente = await this.existeByUsuarioEdit(data.usuario, id);
            if (usuarioExistente) {
                throw new AppError("El usuario ya está en uso por otro usuario", 400);
            }
            const emailExistente = await this.existeByEmailEdit(data.email_usuario, id);
            if (emailExistente) {
                throw new AppError("El email ya está en uso por otro usuario", 400);
            }
            //--------------------------------------------------

            
            const [updated] = await this.usuario.update(data, {
                where: { id_usuario: id },
                transaction: t,
            });
    
            if (updated === 0) {
                throw new AppError("No se actualizó ningún usuario", 404);
            }
    
            const usuarioActualizado = await this.usuario.findOne({
                where: { id_usuario: id },
                transaction: t,
            });
    
            await t.commit();
            return usuarioActualizado;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    };
    // Eliminar un usuario dentro de una transacción
    async delete(id_usuario) {
        const t = await db.sequelize.transaction();
        try {
            const usuario = await this.getById(id_usuario);

            if (!usuario) throw new AppError("Usuario no encontrado", 404);

            await this.usuario.destroy({
                where: { id_usuario: id_usuario },
                transaction: t,
            });

            await t.commit();
            return usuario;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    };
//----------------------------------------------------------------
// Existe Usuario con el mismo usario excluyendo el actual
    async existeByUsuarioEdit(usuario, idExcluir = null) {
        const where = { usuario };
        if (idExcluir) {
            where.id_usuario = { [Op.ne]: idExcluir };
        }
        const existe = await this.usuario.findOne({ where });
        return !!existe;
    };

    async existeByDniEdit(dni_usuario, idExcluir = null) {
        const where = { dni_usuario };
        if (idExcluir) {
            where.id_usuario = { [Op.ne]: idExcluir };
        }
        const existe = await this.usuario.findOne({ where });
        return !!existe;
    }

    async existeByEmailEdit(email_usuario, idExcluir = null) {
        const where = { email_usuario };
        if (idExcluir) {
            where.id_usuario = { [Op.ne]: idExcluir };
        }
        const existe = await this.usuario.findOne({ where });
        return !!existe;
    }
//----------------------------------------------------------------
    // Validar si el email ya existe
    async existeByEmail(email_usuario) {
        const usuario = await this.usuario.findOne({
            where: { email_usuario: email_usuario },
        });
        if (usuario) {
            throw new AppError('El email ya está en uso', 400);
        }
    };

    // Validar si el usuario ya existe
    async existeByUsuario(usuario) {
        const user = await this.usuario.findOne({
            where: { usuario: usuario },
        });
        if (user) {
            return user;
        }
        return false;
        
    };

    // Validar si el dni ya existe
    async existeByDni(dni_usuario) {
        const user = await this.usuario.findOne({
            where: { dni_usuario: dni_usuario },
        });
        if (user) {
            throw new AppError('El DNI ya está en uso', 400);
        }
    };


// Búsqueda y filtrado de usuarios (MSSQL-friendly)
  /**
   * search: búsqueda incremental + filtros exactos
   * - q: texto libre (>= 2 chars). Busca en:
   *   nombre_usuario, apellido_usuario, dni_usuario, telefono_usuario, email_usuario, usuario
   * - email: match exacto sobre email_usuario
   * - dni:   match exacto sobre dni_usuario
   * - telefono: match exacto sobre telefono_usuario
   * - limit/offset: paginación (limit máx 100). En MSSQL requiere ORDER BY estable.
   *
   * Devuelve un set "liviano" ideal para autocompletar.
   * Ajustá los nombres de columna si en tu modelo difieren.
   */
    async search({ q, email, dni, telefono, limit = 10, offset = 0 }) {
    const whereParts = [];

    if (email) whereParts.push({ email_usuario: String(email).trim() });
    if (dni) whereParts.push({ dni_usuario: String(dni).trim() });
    if (telefono) whereParts.push({ celular_usuario: String(telefono).trim() });

    if (q && String(q).trim().length >= 2) {
      const text = `%${String(q).trim()}%`;
      whereParts.push({
        [Op.or]: [
          this.ciLike('nombre_usuario', text),
          this.ciLike('apellido_usuario', text),
          this.ciLike('dni_usuario', text),        // numérico -> CAST + LOWER ok
          this.ciLike('celular_usuario', text),   // numérico -> CAST + LOWER ok
          this.ciLike('email_usuario', text),
          this.ciLike('usuario', text)
        ]
      });
    }

    const results = await this.usuario.findAll({
      where: whereParts.length ? { [Op.and]: whereParts } : undefined,
      attributes: [
        'id_usuario',
        'nombre_usuario',
        'apellido_usuario',
        'dni_usuario',
        'celular_usuario',
        'email_usuario',
        'usuario'
      ],
      order: [
        ['apellido_usuario', 'ASC'],
        ['nombre_usuario', 'ASC'],
        ['id_usuario', 'ASC']
      ],
      limit: Math.min(Number(limit) || 10, 100),
      offset: Number(offset) || 0
    });

    return results;
  }



};
module.exports = UsuarioService;