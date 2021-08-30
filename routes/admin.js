const router = require('express').Router();


router.get('/', (req, res) => {
    res.json({
        error: null,
        data: {
            title: 'mi ruta protegida',
            user: req.user// est usuario se crea en la validacion
        }
    })
})

module.exports = router
