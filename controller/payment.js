const express = require("express");
const paymentRoute = express.Router();
const stripe = require('stripe')('sk_test_51Kb3jnSDwXbsOnZOQ4FuUW2Tw44ygW4hAJ11yx57i7Hze0CB5eYsOlcoodwThlZyzAAa3k0BXG41HwRBQ7dw1GYf00bJuew2St');

paymentRoute.post('/process-payment', async (req, res) => {
  const paymentMethodId = req.body.paymentMethodId;
  const paymentIntentId = req.body.paymentIntentId;

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    res.render('payment-success', { paymentIntent });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.redirect('/checkout-page');
  }
});

module.exports = paymentRoute;
