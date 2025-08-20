const { Sequelize } = require('sequelize');

const { development } = require('./config.json');


class Database {
    constructor(){
        this.config = development;
        this._entorno();
    }

    async maindb(){
        await this.conexion();
        await this.testConnection();
    }
    
    _entorno(){ 
        this.port = this.config.db_port;
        this.host = this.config.host;
        this.database = this.config.database;
        this.username = this.config.username;
        this.password = this.config.password;
    }

    async conexion(){
        this.sequelize = new Sequelize(
            this.database,
            this.username,
            this.password,
            {
                host: this.host,
                dialect: 'postgres',
                port: this.port,
                logging: console.log,
                define: {
                    timestamps: true,
                },
            }
        )

    }

    async testConnection(){
        try {
            await this.sequelize.authenticate();
            console.log('✅ Conexión a la base de datos exitosa.');       
        } catch (error) {
            console.error('❌ Error de conexión a la base de datos:', error);
        }
    }

}


module.exports = Database;