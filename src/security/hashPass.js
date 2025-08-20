
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;    

    } catch (error) {
        console.error('Hubo un error al hashear la contraseña', error);
        throw error;
    } 
}

async function matchPassword(password, hashPassword) {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        console.error('Hubo un error al comparar las contraseñas', error);
        throw error;
    }
    
}

module.exports = { hashPassword, matchPassword };