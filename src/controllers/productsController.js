const { validationResult } = require('express-validator');
const db = require('../database/models');

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
    },

    
}    

const detail={
    get:(req,res)=>{
        const id = req.params.id
        res.render('products/detail.ejs')
    }
}

module.exports = {
    addProduct,
    detail
}