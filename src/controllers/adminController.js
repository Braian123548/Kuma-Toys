const { validationResult } = require('express-validator');
const db = require('../database/models');

const addProduct = {
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
    },
    post:  (req, res) => {
        
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                const { name, discount, description, price, categoryId, quantity } = req.body;

                db.Products.create({
                    name: name.trim(),
                    discount: discount || 0,
                    description: description.trim(),
                    price,
                    categoryId,
                    quantity,
                    mainImage: req.files.image ? req.files.image[0].filename : [],
                    image: req.files.images ? req.files.images[0].filename : [],
                })
                .then(product => {
                    if (req.files.images) {
                        return res.redirect('/users/admin');
                        }
                    })
                .catch(error => console.log(error))
            } else {
                if(req.files.length){
                    req.files.forEach(file => {
                        existsSync('./public/images/' + file.filename) && unlinkSync('./public/images/' + file.filename)
                    });
                }
        
            
        
        
        
            db.Categories.findAll({
                order: ['name']
            })
            .then((categories) => {
                return res.render("./admin/addBand", {
                    categories,
                    errors : errors.mapped(),
                    old : req.body
                });
            })
            .catch((error) => {
                console.log(error);
                
            })
        }
    }
}  



module.exports = {
    addProduct
}