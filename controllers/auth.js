const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response ) => {

    // const { name, email, password } = req.body;
    // if ( name.length < 5) {
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El nombre debe ser mayor de 5 letras'
    //     });
    // }
    
    // manejo de errores
    // const errors = validationResult( req );
    // if ( !errors.isEmpty() ) {
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email: email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese correo'
            });
        }

        usuario = new Usuario(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        await usuario.save();

         // Generar nuestro JWT
         const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token

            //msg: 'registro',
            // name,
            // email,
            // password
        });
    } catch (error) {
        console.log(error);        
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el Administrador'
        });
    }
}

const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email: email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error);        
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el Administrador'
        });
    }
}

const revalidarToken = async(req, res = response ) => {

    // Generar un nuevo JWT y retornarlo en esta petición
    const uid = req.uid;
    const name = req.name;
    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token
    });
}

module.exports = { 
    crearUsuario,
    loginUsuario,
    revalidarToken
}
