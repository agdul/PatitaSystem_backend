const { verificarToken } = require('../security/token');
const responseHelper = require('../utilits/helpers/responseHelper');

const verificarTokenMiddlerware = async (req, res, next) => {
    try {
        const tokenAutorizado = req.header('Authorization');
        //console.log('👉 Header Authorization:', tokenAutorizado);
        if (!tokenAutorizado) {
            return responseHelper.error(res, 'Token no encontrado', 401);
        }
        const token = tokenAutorizado.split(' ')[1];
        //console.log('👉 Token limpio:', token);
        if (!token) {
            return responseHelper.error(res, 'Token invalido', 403);
        }

        const tokenValidado = await verificarToken(token);
        req.user = tokenValidado;
        //console.log('👉 Usuario autenticado:', req.user);
        next();
    } catch (error) {
        return responseHelper.error(res, 'Token invalido', 403);
    }
}

module.exports = { verificarTokenMiddlerware };