const db = require('../database/models');

const shop = {
    get: async (req, res) => {
        const idUser = req.session.userLogin || req.session.userAdmin;
        let favorites = [];
        if (idUser) {
            favorites = await db.Favorites.findAll({
                where: {
                    userId: idUser.id
                }
            });
        }
        await db.Products.findAll()
        .then((products) => {
            return res.render("shop", {
                products,favorites, title:"shop"
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