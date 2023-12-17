const db = require('../database/models');

module.exports = {
    showAll: async (req, res) => {
        try {

            if (!req.session.cart) {
                let error = new Error()
                error.message = 'Debes loguearte';
                error.status = 404;
                throw error
            }

            return res.status(200).json({
                ok: true,
                cart: req.session.cart,
                message: "ok"
            })

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                cart: null,
                message: error.message || 'Upss, hubo un error'
            })
        }
    },
    addItem: async (req, res) => {
        try {
            if (!req.session.cart) {
                let error = new Error()
                error.message = 'Sin acceso al carrito, logueate';
                error.status = 404;
                throw error
            }

            console.log(req.body)

            const { quantity, product: id } = req.body;

            const { name, imagen, price, descuento } = await db.Products.findByPk(id);

            if (req.session.cart.products.map(product => product.id).includes(id)) {
                req.session.cart.products = req.session.cart.products.map(product => {
                    if (product.id === +id) {
                        ++product.quantity
                    }
                    return product
                });

                /* BD */
                await db.Item.update(
                    {
                        quantity: req.session.cart.products.find(product => product.id === +id).quantity
                    },
                    {
                        where: {
                            orderId: req.session.cart.orderId,
                            productId: id
                        }
                    }
                )

            } else {
                req.session.cart.products.push({
                    id,
                    name,
                    imagen,
                    price,
                    descuento,
                    quantity,
                });

                /*BD*/
                await db.Item.create({
                    quantity: 1,
                    orderId: req.session.cart.orderId,
                    productId: id
                })

            }



            req.session.cart.total = req.session.cart.products.map(product => product.price * product.quantity).reduce((a, b) => a + b, 0).toFixed(2)

            return res.status(200).json({
                ok: true,
                cart: req.session.cart,
                message: "Producto agregado al carrito"
            })


        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                cart: null,
                message: error.message || 'Upss, hubo un error'
            })
        }
    },


    removeItem: async (req, res) => {
        try {
            if (!req.session.cart) {
                let error = new Error()
                error.message = 'Sin acceso al carrito, logueate';
                error.status = 404;
                throw error
            }
            const { product: id } = req.query;
            req.session.cart.products = req.session.cart.products.map(product => {
                if (product.id === +id && product.quantity > 1) {
                    --product.quantity
                }
                return product
            });

            /* base de datos */
            await db.Item.update(
                {
                    quantity: req.session.cart.products.find(product => product.id === +id).quantity
                },
                {
                    where: {
                        orderId: req.session.cart.orderId,
                        productId: id
                    }
                }
            )


            req.session.cart.total = req.session.cart.products.map(product => product.price * product.quantity).reduce((a, b) => a + b, 0).toFixed(2)

            return res.status(200).json({
                ok: true,
                cart: req.session.cart,
                message: "Producto eliminado "
            })



        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                cart: null,
                message: error.message || 'Upss, hubo un error'
            })
        }
    },
    removeAllItem: async (req, res) => {
        try {
            if (!req.session.cart) {
                let error = new Error()
                error.message = 'Debes loguearte';
                error.status = 404;
                throw error
            }

            const { product: id } = req.query;

            req.session.cart.products = req.session.cart.products.filter(product => product.id !== +id);

            /* BD */
            await db.Item.destroy(
                {
                    where: {
                        orderId: req.session.cart.orderId,
                        productId: id
                    }
                }
            )


            req.session.cart.total = req.session.cart.products.map(product => product.price * product.quantity).reduce((a, b) => a + b, 0).toFixed(2)

            return res.status(200).json({
                ok: true,
                cart: req.session.cart,
                message: "Productos eliminados exitosamente"
            })



        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                cart: null,
                message: error.message || 'Upss, hubo un error'
            })
        }
    },
    emptyCart: async (req, res) => {
        try {
            if (!req.session.cart) {
                let error = new Error()
                error.message = 'Debes loguearte';
                error.status = 404;
                throw error
            }

            req.session.cart = {
                ...req.session.cart,
                products: [],
                total: 0
            }

            /* base de datos */
            await db.Item.destroy(
                {
                    where: {
                        orderId: req.session.cart.orderId,
                    }
                }
            )


            return res.status(200).json({
                ok: true,
                cart: req.session.cart,
                message: "Carrito vacio exitosamente"
            })

        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                cart: null,
                message: error.message || 'Upss, hubo un error'
            })
        }
    }
}