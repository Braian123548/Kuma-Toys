const { check, body } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../database/models');

module.exports = [
    check('email')
        .notEmpty().withMessage('El email es requerido').bail()
        .isEmail().withMessage('El formato es inválido'),
    check('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .custom(async (value, { req }) => {
            const user = await db.Users.findOne({
                where: {
                    email: req.body.email
                }
            });

            if (!user) {
                return Promise.reject('Credenciales inválidas');
            }

            const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if (!passwordMatch) {
                return Promise.reject('Credenciales inválidas');
            }
        })
];
