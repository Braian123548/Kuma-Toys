const db = require('../database/models');
const { Op } = require("sequelize");

const shop = {
    get: async (req, res) => {
        const idUser = req.session.userLogin || req.session.userAdmin;
        const query = req.query.q;
        const category = req.query.category;
        const priceMin = parseInt(req.query['price-min'], 10);
        const priceMax = parseInt(req.query['price-max'], 10);

        const categories = await db.Categories.findAll();
        res.locals.q = query
        let favorites = [];
        if (idUser) {
            favorites = await db.Favorites.findAll({
                where: {
                    userId: idUser.id
                }
            });
        }
        let whereClause = {};
        if (query) {
            whereClause[Op.or] = [
                { name: { [Op.like]: '%' + query + '%' } },
                { '$category.name$': { [Op.like]: '%' + query + '%' } }
            ];
        }
        if (category) {
            whereClause['$category.name$'] = category;
        }
        if (priceMin) {
            whereClause.price = { [Op.gte]: priceMin };
        }
        if (priceMax) {
            if (!whereClause.price) whereClause.price = {};
            whereClause.price[Op.lte] = priceMax;
        }
        await db.Products.findAll({ 
            where: whereClause,
            include: [{
                model: db.Categories,
                as: 'category'
            }]
        })
        .then((products) => {
            return res.render("shop", {
                products, favorites, title: "shop", q: query , selectedCategory: category,
                selectedPriceMin: priceMin,
                selectedPriceMax: priceMax, categories
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

