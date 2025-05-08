import express from 'express';
import Stripe from 'stripe';
const router = express.Router();

const stripe = new Stripe('sk_test_51RDZY2B2sb9Z6fmO4uIHiNaNziP8Ir1EIwVDbGRCNnXjvLQY59FKXsGG5h7Ak6MfYlcbJAchde1YndHmMSVkB7va00BOucxE93'); // from Stripe Dashboard

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
