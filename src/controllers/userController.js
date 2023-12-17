const { validationResult } = require('express-validator');
const db = require('../database/models')
const User = require('../database/models/user')
const bcrypt = require('bcrypt');

const register = {
    get: (req, res) => {
        res.render('register' , {title:"register"});
    },
    post: async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render('register', { errors: errors.mapped(), old: req.body ,title:"register" });
            }

            const { firstName, lastName, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await db.Users.create({
                username: firstName,
                email: email,
                password: hashedPassword
            });

            return res.redirect('/user/login');
        } catch (error) {
            console.error(error);
            return res.status(500).render('error', { error: 'Internal Server Error' });
        }
    }
}

 const login = {
     get: (req, res) => {
         res.render('login',{title:"login"});
     },
     post: async (req, res) => {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             return res.status(400).render('login', { errors: errors.mapped(), old: req.body, title:"login"});
         }

         await db.Users.findOne({
            where : {
                email: req.body.email
            }
        })
        .then(user=> {
            if(user.rol === 'admin') {
                req.session.userAdmin = {
                    id: user.id,
                    firtsName: user.firtsName,
                    lastName: user.lastName, 
                }
            } else {
                req.session.userLogin = {
                    id: user.id,
                    firtsName: user.firtsName,
                    lastName: user.lastName, 
                }
            }
        
            if (req.body.remember) {
                if(user.rol === 'admin') {
                    res.cookie("Kuma-Toys", req.session.userAdmin, {
                        maxAge: 1000 * 60 * 5,
                    });
                } else {
                    res.cookie("Kuma-Toys", req.session.userLogin, {
                        maxAge: 1000 * 60 * 5,
                    });
                }
            }

                    /* ShoppingCart */

                    db.ShoppingCarts.findOne({
                        where : {
                            userId : user.id,
                            statusId : 1
                        },
                        include : [
                            {
                                association : 'items',
                                include : {
                                    association : 'product',
                                }
                            }
                        ]
                    }).then( order => {
                        if(order){
                            req.session.cart = {
                                orderId : order.id,
                                products : order.items.map(({quantity,product: {id, name, imagen, price, descuento}}) => {
                                    return {
                                        id,
                                        name,
                                        imagen,
                                        price,
                                        descuento,
                                        quantity,
                                }
                                }),
                                total : order.items.map(item => item.product.price * item.quantity).reduce((a,b) => a+b, 0).toFixed(2)
                            }
    
                            console.log(req.session.cart);
    
                            return res.redirect('/')
    
                        } else {
                            db.ShoppingCarts.create({
                                total : 0,
                                userId : user.id,
                                statusId : 1
                            }).then(order => {
                                req.session.cart = {
                                    orderId : order.id,
                                    products : [],
                                    total : 0,
                                }
                                console.log(req.session.cart);
                                return res.redirect('/')
    
                            })
                        }
                    })
            
        
            
             })
             .catch(error => console.log(error))
     }
 }

module.exports = {
    register,
     login
}
