const db = require('../database/models');

const shop = {
    get: (req, res) => {
        db.Products.findAll()
        .then((products) => {
            return res.render("shop", {
                products, title:"shop"
            });
        })
        .catch((error) => {
            console.log(error);
            
        });
    }
}       

module.exports = {
    shop
}