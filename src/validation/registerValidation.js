const { check, body } = require('express-validator');
const db = require('../database/models')

module.exports = [
    //VALIDACIONES DEL REGISTER
    check('firstName')
        .notEmpty().withMessage('El campo nombre es obligatorio').bail()
        .isAlpha('es-ES')
        .withMessage("Solo se permiten caracteres alfabéticos"),
    check('lastName')
        .notEmpty().withMessage('El campo apellido es obligatorio').bail()
        .isAlpha('es-ES')
        .withMessage("Solo se permiten caracteres alfabéticos"),
    check("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .bail()
        .isEmail()
        .withMessage("Email no válido").bail()
         .custom((value) => {
             return db.Users.findOne({
                 where: {
                     email: value
                 }
             })
                 .then(user => {
                     if (user) {
                         return Promise.reject()
                     }

                 })
                 .catch(() => Promise.reject('El email ya se encuentra registrado'))
         }),
    check("password")
        .isLength({
            min: 6,
            max: 12,
        })
        .withMessage("Debe tener entre 6 y 12 caracteres"),
    body("password2")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false;
            }
            return true;
        })
        .withMessage("Las contraseñas no coinciden"),
    
];