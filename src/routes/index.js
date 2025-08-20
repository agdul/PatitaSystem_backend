const fs = require('fs');
const express = require('express');
const router = express.Router();

const PATH_ROUTES = __dirname;
const removext = (filename) => (filename.split('.').shift());
const xd = fs.readdirSync(PATH_ROUTES).filter((file)=>{
    const name = removext(file);
    if(name !== 'index'){
        console.log ('✅ [Rutas Cargadas] :',name);
        router.use(`/${name}`, require(`./${name}`));
    }
});

module.exports = router;