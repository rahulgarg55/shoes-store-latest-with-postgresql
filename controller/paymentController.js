const { pk_test_51Kb3jnSDwXbsOnZO1uIwG9W5McH3DNVvee38MdLtJiGu2yAlcsbGnMd9pOckIN9dcwsQOPnArC6XnBPcEHCwVizj00EqZMqZl2, sk_test_51Kb3jnSDwXbsOnZOQ4FuUW2Tw44ygW4hAJ11yx57i7Hze0CB5eYsOlcoodwThlZyzAAa3k0BXG41HwRBQ7dw1GYf00bJuew2St } = process.env;

const stripe = require('stripe')(sk_test_51Kb3jnSDwXbsOnZOQ4FuUW2Tw44ygW4hAJ11yx57i7Hze0CB5eYsOlcoodwThlZyzAAa3k0BXG41HwRBQ7dw1GYf00bJuew2St)

const renderBuyPage = async(req,res)=>{

    try {
        
        res.render('buy', {
            key: pk_test_51Kb3jnSDwXbsOnZO1uIwG9W5McH3DNVvee38MdLtJiGu2yAlcsbGnMd9pOckIN9dcwsQOPnArC6XnBPcEHCwVizj00EqZMqZl2,
            amount:25
         })

    } catch (error) {
        console.log(error.message);
    }

}

const payment = async(req,res)=>{

    try {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Rahul Garg',
        address: {
            line1: '10, Peer Colony',
            postal_code: '147105',
            city: 'patiala',
            state: 'Punjab',
            country: 'India',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: req.body.amount,     // amount will be amount*100
            description: req.body.productName,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.redirect("/success")
    })
    .catch((err) => {
        res.redirect("/failure")
    });


    } catch (error) {
        console.log(error.message);
    }

}

const success = async(req,res)=>{

    try {
        
        res.render('success');

    } catch (error) {
        console.log(error.message);
    }

}

const failure = async(req,res)=>{

    try {
        
        res.render('failure');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    renderBuyPage,
    payment,
    success,
    failure
}