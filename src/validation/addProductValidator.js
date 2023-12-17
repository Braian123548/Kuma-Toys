const { check, body } = require('express-validator');

module.exports = [

    check('name')
        .notEmpty().withMessage('Éste campo es obligatorio').bail()
        .isLength({
            min: 2,
            max: 255
        }).withMessage('el nombre debe tener entre 2 y 255'),

    check('categoryId')
        .notEmpty().withMessage('La categoria es obligatorio'),
    
    check('discount')
        .notEmpty().withMessage('Éste campo es obligatorio').bail()
        .isNumeric().withMessage('El descuento debe ser un número válido'),

    check('price')
        .notEmpty().withMessage('Éste campo es obligatorio').bail()
        .isNumeric().withMessage('El precio debe ser un número válido'),

    check('quantity')
        .notEmpty().withMessage('Éste campo es obligatorio').bail()
        .isNumeric().withMessage('la cantidad  debe ser un número válido'),    
        
    check('description')
        .notEmpty().withMessage('Éste campo es obligatorio').bail()
        .isLength({
            min: 20,
            max: 500
        }).withMessage('La cantidad de caracteres admitidos es entre 20 y 500'),

    body('image')
        .custom((value, { req }) => {
            if (req.files && req.files.image) {
                return true;
            }
            return false;
        })
        .withMessage('La imagen principal del producto es obligatoria'),

    body('images')
        .custom((value, { req }) => {
            if (req.files && req.files.images) {
                return true;
            }
            return false;
        })
        .withMessage('Ingrese las imagenes secundarias ')
]