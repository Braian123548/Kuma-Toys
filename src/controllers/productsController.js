const { validationResult } = require('express-validator');
const db = require('../database/models');
const fs = require('fs');
const { existsSync, unlinkSync } = fs;
const path = require('path');


const addProduct = {
    post: async (req, res) => {

        const { name, description, descripcion, price, cantidad, categoria, descuento } = req.body;
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
                descripcion: descripcion,
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

    get: async (req, res) => {
        const id = req.params.id;
        const product = await db.Products.findOne({
            where: {
                id: id
            }
        });

        const imagenes = await db.Images.findAll({
            where: {
                productId: id
            }
        });

        if (product === null) {
            console.log('Producto no encontrado');
            return;
        }

        const filenames = imagenes.map(image => image.dataValues.filename);


        const idUser = req.session.userLogin || req.session.userAdmin;
        let favorites = [];
        if (idUser) {
            favorites = await db.Favorites.findAll({
                where: {
                    userId: idUser.id
                }
            });
        }

        res.render("./products/detail", { product: product.dataValues, images: filenames, favorites: favorites, })
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

            const images = await db.Images.findAll({ where: { productId: id } })
            images.forEach(image => {
                const filePath = path.join(__dirname, "..", "..", "public", 'images', 'products', image.filename);
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error(`Error al eliminar el archivo ${filePath}:`, err);
                    } else {
                        console.log(`Archivo ${filePath} eliminado con éxito.`);
                    }
                });
            });

            const products = await db.Products.findOne({ where: { id: id } });
            const filePath = path.join(__dirname, "..", "..", "public", 'images', 'products', products.imagen);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error(`Error al eliminar el archivo ${filePath}:`, err);
                } else {
                    console.log(`Archivo ${filePath} eliminado con éxito.`);
                }
            });

            await db.ShoppingCarts.destroy({ where: { productId: id } });

            await db.Favorites.destroy({ where: { productId: id } });

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

    put: (req, res) => {

        const errors = validationResult(req);
        const id = req.params.id;
        const { name, description, price, cantidad, categoria, descuento } = req.body;
        console.log(name, description, price, cantidad, categoria, descuento);



        if (errors.isEmpty()) {

            db.Products.findByPk(id, {
                include: ["images"],
            })
                .then((product) => {
                    req.files.image &&
                        existsSync(`./public/images/products/${product.image}`) &&
                        unlinkSync(`./public/images/products/${product.image}`);

                    db.Products.update(
                        {
                            name: name.trim(),
                            description: description.trim(),
                            price,
                            cantidad,
                            categoria,
                            descuento,

                            image: req.files.image ? req.files.image[0].filename : product.image,
                        },
                        {
                            where: {
                                id,
                            },
                        }
                    ).then(() => {
                        if (req.files.images) {
                            product.images.forEach((image) => {
                                    existsSync(`./public/images/products/${image.file}`) &&
                                    unlinkSync(`./public/images/products/${image.file}`);
                            });

                            db.Images.destroy({
                                where: {
                                    productId: id,
                                },
                            }).then(() => {
                                const images = req.files.images.map((file) => {
                                    return {
                                        file: file.filename,
                                        main: false,
                                        productId: product.id,
                                    };
                                });
                                db.Images.bulkCreate(images, {
                                    validate: true,
                                }).then((response) => {
                                    return res.redirect("/admin");
                                });
                            });
                        } else {
                            return res.redirect("/admin");
                        }
                    });
                })
                .catch((error) => console.log(error));
        }
    }
}

const favorite = {

    getFavorites: async (req, res) => {
        const idUser = req.session.userLogin || req.session.userAdmin;

        if (!idUser) {
            return res.redirect("/user/login");
        }
        const id = idUser.id;

        const favorites = await db.Favorites.findAll({
            where: {
                userId: id
            },
            include: [{
                model: db.Products,
                as: 'product'
            }]
        });


        const products = favorites.map(favorite => favorite.product);

        res.render('favorite', { products: products, favorites: favorites });
    },


    shop: async (req, res) => {
        const idProduct = req.params.id;
        const idUser = req.session.userLogin || req.session.userAdmin;

        if (!idUser) {
            return res.status(401).send('No autorizado');
        }
    

        const id = idUser.id;

        const favoriteProduct = await db.Favorites.findOne({
            where: {
                userId: id,
                productId: idProduct
            }
        });

        let isFavorite;
        if (favoriteProduct) {
            await favoriteProduct.destroy();
            isFavorite = false;
        } else {
            await db.Favorites.create({
                userId: id,
                productId: idProduct
            });
            isFavorite = true;
        }

        res.json({ isFavorite: isFavorite });
    },


}


const profile = {
    get: (req, res) => {
        res.render('profile')
    }
}

module.exports = {
    addProduct,
    detail,
    updateProduct,
    remove,
    favorite,
    profile
}