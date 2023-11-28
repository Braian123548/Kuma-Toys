const { validationResult } = require('express-validator');
const db = require('../database/models');
const { existsSync, unlinkSync } = require('fs');


const addProduct = {
    get: async (req, res) => {
        await db.Products.findAll()
        .then((products) => {
            return res.render("admin", {
                products,
            });
        })
        .catch((error) => {
            console.log(error);
            
        });
    },
    post:  async (req, res) => {
        
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                const { name, discount, description, price, categoryId, quantity } = req.body;

                await db.Products.create({
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
                        return res.redirect('/admin');
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
    },

    
}    

const detail={
    get:(req,res)=>{
        const id = req.params.id
        res.render('products/detail.ejs')
    }
}

const editProduct = {
    get : async (req, res) => {

        try {
            const id = req.params.id;
            const category = await db.Categories.findAll();
            const product = await db.Products.findByPk(id);
            return res.render('./admin/editProduct', {
                category,
                product  
            })
        } catch (error) {
            return console.log(error)
        }
    }
}

const updateProduct = {
    put : (req, res) => {

        const errors = validationResult(req);
        const id = req.params.id;
        const { name, discount, description, price, categoryId, quantity } = req.body;
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
    editProduct,
    updateProduct
}