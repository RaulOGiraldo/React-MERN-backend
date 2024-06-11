/*
    Rutas de Events / Events
    host + /api/events
*/

const { Router } = require('express');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Todas tienen que pasar por la validacion del JWT
router.use( validarJWT );

// Obtener eventos
router.get( '/', getEventos );

// Crear un nuevo evento
router.post( '/', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatorio').custom( isDate ),
        check('end','Fecha de finalización es obligatorio').custom( isDate ),
        validarCampos
    ],
    crearEvento );

// Actualizar un nuevo evento
router.put( '/:id', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatorio').custom( isDate ),
        check('end','Fecha de finalización es obligatorio').custom( isDate ),
        validarCampos
    ],
    actualizarEvento );

// Borrar un evento
router.delete( '/:id', eliminarEvento );

module.exports = router;
