require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Database = require('./src/config/database');


class Servidor {
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3001;
        this.host = process.env.HOST || 'localhost';

    }

    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from localhost:3000
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Specify allowed HTTP methods
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Specify allowed headers
            // Handle preflight OPTIONS requests
            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
          });
    }

    routes(){
        this.app.use('/api/v1', require('./src/routes'));
    }


    async dbConnection(){
        const db = new Database();
        await db.maindb();
    }

    listen(){
        this.app.listen(this.port, this.host, () => {
            console.log(`✅ Servidor corriendo en http://${this.host}:${this.port}/api/v1`);
        });
    }

    async mainserver(){
        this.middlewares();
        this.routes();
        await this.dbConnection();
        this.listen();
    }

}

const server = new Servidor();
server.mainserver();