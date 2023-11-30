const { check } = require('express-validator');
const { readJSON } = require("../data/index");

const profileValidation = [
    check('firstName').notEmpty().withMessage('Nombre es obligatorio'),
    check('lastName').notEmpty().withMessage('Apellido es obligatorio'),
    check('email').isEmail().withMessage('Email no es válido')
    .custom((value) => {
        const users = readJSON('users.json');
        const user = users.find(user => user.email === value);
        if(user){
            return false
        }
        return true
    }).withMessage('El email ya se encuentra registrado')
    ,
    check('shipping').notEmpty().withMessage('Direccion es obligatorio'),
    check('phone').notEmpty().withMessage('Telefono es obligatorio'),
    check('mainImage').notEmpty().withMessage('Imagen es obligatorio'),
];

module.exports = profileValidation