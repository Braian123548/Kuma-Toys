const { validationResult } = require('express-validator');
const db = require('../database/models');

const admin = {
    get: async (req, res) => {
        try {
            const categorias = await db.Categories.findAll()
            const product = await db.Products.findAll({
                include: {
                    model: db.Categories,
                    as: 'category',
                    attributes: ['name']
                }
            });

            res.render("admin", { product: product,categorias, title: "admin" });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
}  



module.exports = {
    admin
}