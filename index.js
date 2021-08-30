const router = require('express').Router();
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config() // con esto lee la contrase 

const app = express();

// cors
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


// Conexión a Base de datos
    const uri = `mongodb+srv://${process.env.DATA_BASE_USER}:${process.env.PASSWORD}@bdusuarios.diwzv.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
    const option = { useNewUrlParser: true, useUnifiedTopology: true }
    mongoose.connect(uri,option)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log('error db:', e))

// import routes**
//creamos un archivo de la ruta raiz de auth 
    const authRoutes = require('./routes/auth');
    const validaToken = require('./routes/validate-token');//llamamos la funcion del validador del token
    const admin = require('./routes/admin');

// route middlewares**
    app.use('/api/user', authRoutes);// en postman se coloca register para los usuarios
    app.use('/api/admin',validaToken, admin);//midalware: validatoken va al centro xq si se valida en validatoken muestra la rspuesta sino no

app.get('/', (req, res) => {//no es necesario lo puedo borrar
        res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

// iniciar servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})