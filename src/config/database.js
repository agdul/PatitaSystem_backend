// src/config/database.js
const { Sequelize } = require('sequelize');
const config = require('./config.json');

/**
 * Clase Database
 * - Lee la configuración por entorno (NODE_ENV) desde config.json
 * - Crea la instancia de Sequelize (pool de conexiones)
 * - Expone un método de prueba de conexión
 *
 * Métodos relevantes:
 * - constructor(): resuelve el entorno y cachea config
 * - conexion(): crea Sequelize con dialect 'mssql' (driver 'tedious')
 * - testConnection(): hace authenticate() y loguea el resultado
 * - maindb(): orquesta conexión + test
 */
class Database {
  constructor() {
    const env = process.env.NODE_ENV || 'development';
    this.config = config[env];
    this._entorno();
  }

  _entorno() {
    this.dialect = this.config.dialect;        // 'mssql'
    this.host = this.config.host;              // 'localhost'
    this.port = this.config.port;              // 1433 si usás puerto (undefined si usás instanceName)
    this.database = this.config.database;      // 'db_patitaSystem'
    this.username = this.config.username;      // 'ADM_Patita'
    this.password = this.config.password;      // 'patitasystem'
    this.logging = this.config.logging ?? false;
    this.define = this.config.define || { timestamps: true };
    this.dialectOptions = this.config.dialectOptions || {};
  }

  async conexion() {
    this.sequelize = new Sequelize(this.database, this.username, this.password, {
      host: this.host,
      port: this.port,                    // Omitido si usás instanceName
      dialect: this.dialect,              // mssql
      logging: this.logging,
      define: this.define,
      dialectOptions: this.dialectOptions
    });
  }

  async testConnection() {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Conexión a SQL Server exitosa.');
    } catch (error) {
      console.error('❌ Error de conexión:', error);
    }
  }

  async maindb() {
    await this.conexion();
    await this.testConnection();
  }
}

module.exports = Database;
