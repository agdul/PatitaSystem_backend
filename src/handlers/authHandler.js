const AuthController = require("../controllers/authController");
const AppError = require('../utilits/helpers/errors');

class AuthHandler {
    static async login(req, res){
        try {
            const data = req.body;
            //console.log('Datos recibidos para inicio de sesión:', data);
            if (!data.usuario || !data.password) {
                throw new AppError('Usuario y contraseña son requeridos', 400);
            }
            const user = await AuthController.loginUsuario(data.usuario, data.password);
            res.status(200).json({ message: 'Inicio de sesión exitoso', user });
        } catch (error) {
            console.error('❌ Error al iniciar sesión:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };
    
    static async register(req, res) {
        try {
            // const { data } = req.body;
            console.log('Datos recibidos para registro:', req.body);
            const data = req.body;
            //const { usuario, password } = data;
            
            if (!data.usuario || !data.password || !data) {
              throw new AppError("Usuario y contraseña son requeridos", 400);
            }
            const newUser = await AuthController.registrarUsuario(data, data.password);
            res
              .status(201)
              .json({ message: "Registro exitoso", usuario: newUser });
        } catch (error) {
            console.error('❌ Error al registrar usuario:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };

    static async logout(req, res) {
        try {
            // Aquí podrías implementar la lógica para cerrar sesión, como eliminar el token de sesión
            res.status(200).json({ message: 'Sesión cerrada exitosamente' });
        } catch (error) {
            console.error('❌ Error al cerrar sesión:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };
  
}

module.exports = AuthHandler;