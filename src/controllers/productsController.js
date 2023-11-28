const { validationResult } = require('express-validator');
const db = require('../database/models');
const { existsSync, unlinkSync } = require('fs');


const addProduct = {
    post: async (req, res) => {

        const { name, description, price, cantidad, categoria, descuento } = req.body;
        console.log(name, description, price, cantidad, categoria, descuento);

        const image = req.files.mainImage ? req.files.mainImage[0].filename : null;
        const images = req.files.images ? req.files.images.map(file => file.filename) : null;

        try {

            const category = await db.Categories.findOne({ where: { name: categoria } });

            if (!category) {
                return res.status(400).send('La categoría no existe');
            }

            const product = await db.Products.create({
                name: name,
                description: description,
                price: price,
                cantidad: cantidad,
                imagen: image,
                categoryId: category.id,
                descuento: descuento
            });

            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    await db.Images.create({
                        filename: images[i],
                        productId: product.id
                    });
                }
            }

            res.redirect('/admin')

        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }




}

const detail = {
    get: (req, res) => {
        const id = req.params.id
        res.render('products/detail.ejs')
    }
}

const remove = {
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await db.Products.findByPk(id);
            if (!product) {
                return res.status(404).send('El producto no existe');
            }

           
            await db.Images.destroy({ where: { productId: id } });

            
            await db.Products.destroy({ where: { id: id } });

            res.redirect('/admin')
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
}


const updateProduct = {

    // get: async (req, res) => {

    //     try {
    //         const id = req.params.id;
    //         const category = await db.Categories.findAll();
    //         const product = await db.Products.findByPk(id);
    //         return res.render('./admin/editProduct', {
    //             category,
    //             product
    //         })
    //     } catch (error) {
    //         return console.log(error)
    //     }
    // },

    put: (req, res) => {

        const errors = validationResult(req);
        const id = req.params.id;
        const { name, description, price, cantidad, categoria, descuento } = req.body;
        console.log(name, description, price, cantidad, categoria, descuento);

        const image = req.files.mainImage ? req.files.mainImage[0].filename : null;
        const images = req.files.images ? req.files.images.map(file => file.filename) : null;

        if (errors.isEmpty()) {

            db.Products.findByPk(id)
                .then(product => {
                    if (req.files.image && existsSync(`./public/images/${product.mainImage}`)) {
                        unlinkSync(`./public/images/${product.mainImage}`);
                    }
                    if (req.files.images && existsSync(`./public/images/${product.image}`)) {
                        unlinkSync(`./public/images/${product.image}`)
                    }

                    db.Categories.findAll()
                        .then(category => {
                            db.Products.update(
                                {
                                    name: name.trim(),
                                    discount,
                                    mainImage: req.files.image ? req.files.image[0].filename : band.image,
                                    image: req.files.images ? req.files.images[0].filename : band.images,
                                    price,
                                    description,
                                    quantity,
                                    categoryId
                                },
                                {
                                    where: {
                                        id
                                    }
                                }
                            ).then(() => {
                                if (req.files.image && existsSync(`./public/images/${product.mainImage}`)) {
                                    unlinkSync(`./public/images/${product.mainImage}`);
                                    if (req.files.images && existsSync(`./public/images/${product.image}`)) {
                                        unlinkSync(`./public/images/${product.image}`)
                                    }

                                } else {
                                    return res.redirect('/admin');
                                }
                            });
                        })
                        .catch(error => console.log(error));
                })
        } else {
            const category = db.Categories.findAll()
            const product = db.Products.findByPk(id)
            Promise.all([category, product])
                .then(([category, product]) => {
                    return res.render('./admin/editProduct', {
                        category,
                        product,
                        errors: errors.mapped(),
                        old: req.body
                    })
                })
                .catch(error => console.log(error))
        }


    }
}



module.exports = {
    addProduct,
    detail,
    updateProduct,
    remove
}