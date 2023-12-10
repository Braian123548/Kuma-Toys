const { validationResult } = require('express-validator');
const db = require('../database/models')
const User = require('../database/models/user')
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');



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

            const { firstName, lastName, address, postalCode, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            console.log(postalCode);
            
            const image = req.file ? req.file.filename : null;

            const user = await db.Users.create({
                first_name: firstName,
                last_name: lastName,
                direccion: address,
                cp: postalCode,
                email: email,
                password: hashedPassword,
                image:  image  
            });

            return res.redirect('/user/login');
        } catch (error) {
            console.error(error);
            return res.status(500).render('error', { message: 'Internal Server Error', error: error });
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
            
        
            return res.redirect('/')
             })
             .catch(error => console.log(error))
     }
 }


 const profile ={
  
        get: (req, res) => {
           
            if (!req.session.userLogin && !req.session.userAdmin) {
                return res.redirect('/user/login');
            }
    
           
            db.Users.findOne({
                where: {
                    id: req.session.userLogin ? req.session.userLogin.id : req.session.userAdmin.id
                }
            })
            .then(user => {
          
                res.render('profile', { user: user, title: "Profile" });
            })
            .catch(error => {
                console.error(error);
                return res.status(500).render('error', { error: 'Internal Server Error' });
            });
        },

        put: (req, res) => {
         
            const { firstName, lastName, email, address, postalCode } = req.body;
            const profilePicture = req.file ? req.file.filename : null;
    
         
            db.Users.findOne({
                where: {
                    id: req.session.userLogin ? req.session.userLogin.id : req.session.userAdmin.id
                }
            })
            .then(user => {

                if (profilePicture && user.image) {
                    fs.unlink(path.join(__dirname, "..", "..", "public", 'images', 'profile', user.image), err => {
                        if (err) console.error(err);
                    });
                }
    
                return user.update({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    direccion: address,
                    cp: postalCode,
                    image: profilePicture || user.image
                });
            })
            .then((user) => {
                res.redirect('/user/profile/' + user.id);
            })
            .catch(error => {
                console.error(error);
                return res.status(500).render('error', { error: 'Internal Server Error' });
            });
        }
 }

module.exports = {
    register,
     login,
     profile
}
