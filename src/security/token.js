const jwt = require('jsonwebtoken');

async function generarToken(usuario) {
    const llaveSecreta = process.env.SECRET_KEY
    const payload = {
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        email_usuario: usuario.email_usuario,
        id_rol: usuario.id_rol,
    };

    try {
        const token = jwt.sign(payload, llaveSecreta, {expiresIn: '1h'})
        return token;
    } catch (error) {
        throw new Error('no se pudo generar el token');
    }
}

async function verificarToken(token) {
    const llaveSecreta = process.env.SECRET_KEY
    try {
        const decoded = jwt.verify(token,llaveSecreta);
        return decoded;
    } catch (error) {
        throw new Error('Token invalido');
    }
}

module.exports = { generarToken, verificarToken };