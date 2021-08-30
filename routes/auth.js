
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const bcrypt = require('bcrypt');//llamamos crypt para encriptar
const Joi = require('@hapi/joi');//llamamoa a joi para usar validacion

const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),//tipo de correo
    password: Joi.string().min(6).max(1024).required()
})

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/login', async (req, res) => {
    // validaciones
     const { error } = schemaLogin.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message })
    
        const user = await User.findOne({ email: req.body.email });// si no esta registrado en el re. body es leido lo d postman
            if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });//no esta en la bd

        const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(400).json({ error: 'contraseña no válida' })
    
// creacion del token
    const token = jwt.sign({
        name: user.name,
        id: user._id
     }, process.env.TOKEN_SECRET)
    
    res.header('auth-token', token).json({
        error: null,
        data: {token}
        
    })
})
 //--------------------------------------------------------------------------------------------------------    
router.post('/register', async (req, res) => {//enviamos peticion

     // validaciones de usuario si estuviesen vacios los campos
        const { error } = schemaRegister.validate(req.body)
    
            if (error) {
            return res.status(400).json({error: error.details[0].message})//mostrara error de campos vacios
            }

        const existeElEmail = await User.findOne({ email: req.body.email })//se solicita a la bd si existe el correo
            if (existeElEmail) {// validacion del correo
            return res.status(400).json(
            {error: 'Email ya registrado o existente'})
}
         // hash contraseña
const salt = await bcrypt.genSalt(10);
const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    })
    try {
        const userDB = await user.save();
        res.json({
            error: null,
            data: userDB
        })
    } catch (error) {
        res.status(400).json({error})

    }

    
})

module.exports = router;