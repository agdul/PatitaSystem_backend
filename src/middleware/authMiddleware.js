const responseHelper = require("../utilits/helpers/responseHelper");

const authAdmin = (req, res, next) =>{
    const usuario = req.user;
    //console.log('usuario', usuario);

    if(!usuario || usuario.id_role === 2){
        return responseHelper.error(res, 'No tienes permisos para acceder', 403);
    }
    next();
};

module.exports = { authAdmin };