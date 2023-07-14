const express = require('express');
const paymentRoute = express();
const bodyParser = require('body-parser');
paymentRoute.use(bodyParser.json());
paymentRoute.use(bodyParser.urlencoded({ extended:false }));

const path = require('path');

paymentRoute.set('view engine','ejs');
paymentRoute.set('views',path.join(__dirname, '../views'));

const paymentController = require('../controller/paymentController');

paymentRoute.post('/delete-item', (req, res) => {
    const itemId = req.body.itemId;
    const cartItems = req.session.cartItems || [];
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    req.session.cartItems = updatedCartItems;
    res.sendStatus(200);
});

paymentRoute.get('/', paymentController.renderBuyPage);
paymentRoute.post('/payment', paymentController.payment);
paymentRoute.get('/success', paymentController.success);
paymentRoute.get('/failure', paymentController.failure);
module.exports = paymentRoute;
