// src/routes/PaymentPg/Payment.js

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './Payment.css';
import { useNavigate, useSearchParams} from 'react-router-dom';
import { searchRide } from '../../service/RideService';
import { Alert } from '../../components/Alert';

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51RDZY2B2sb9Z6fmOHQL7ACvqDkel22GczUbiF4qhRRrim1KbozZU6iVDpSLzdxXVzEbYOR0KWwcBSzPTKWzOh9FR00ubqIzm7B');

const PaymentForm = () => {
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  
  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'DISCOUNT50') {
      setMessage('Promo code applied successfully');
      setIsSuccess(true);
      const startLat = searchParams.get('startLat');
      const startLong = searchParams.get('startLong');
      const endLat = searchParams.get('endLat');
      const endLong = searchParams.get('endLong');
      joinCarPool(startLat, startLong, endLat, endLong)
       
    } else {
      setMessage('Invalid promo code');
      setIsSuccess(false);
    }
  };

    const joinCarPool = async (startLat, startLong, endLat, endLong) => {
    const res = await searchRide(startLat, startLong, endLat, endLong);
    if (typeof res.data === "string") {
      Alert.error(res.data);
    } else {
      Alert.success("Ride found Successfully");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
  
 
  
    // Ensure stripe and elements are ready
    if (!stripe || !elements) {
      alert('Stripe has not loaded yet. Please try again later.');
      return;
    }

    const card = elements.getElement(CardElement);

    // Create PaymentMethod with billing details
    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        name: nameOnCard,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    setTimeout(() => {
      setSuccess(true);
    }, 1000);

    setTimeout(() => {
      const startLat = searchParams.get('startLat');
      const startLong = searchParams.get('startLong');
      const endLat = searchParams.get('endLat');
      const endLong = searchParams.get('endLong');
        const res = searchRide(startLat, startLong, endLat, endLong);
    if (typeof res.data === "string") {
      Alert.error(res.data);
    } else {
      navigate("/active-ride")
    }
    }, 1500);
  };

  return (
    <div className="payment-container">
      {/* Header product display */}
      <div className="product-display">
        
        <div className="description">
          <h3>Payment Page</h3>
          <h5>Enter card details to pay for your ride.</h5>
        </div>
      </div>

      {success ? (
        <div className="payment-success">
          <h3>Payment Successful ✅</h3>
          <p>Your ride has been confirmed!</p>
        </div>
      ) : (
        <form className="payment-form" onSubmit={handleSubmit}>
          <label>
            Name on Card
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
            />
          </label>

          <label>
            Card Details
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#fff',
                    '::placeholder': { color: '#ccc' },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </label>
         <div style={{display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'centre' }}>
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          style={{
            flexBasis: '70%',
            height: '50px',
            marginTop: '25px',
          }}
        />
        <button
        type="button"
         onClick={handleApplyPromo}
          style={{
            flexBasis: '30%',
            cursor: 'pointer',
            height: '50px',
            backgroundColor: '#fff',
          }}
        >
          Apply
        </button>
        </div>
        {message && (
        <div
          style={{
            marginTop: '10px',
            color: isSuccess ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </div>
      )}
          <button type="submit">
            Pay Now
          </button>
          
          {/* Google Pay Button */}
          <button 
            type="button" 
            className="google-pay-btn" 
            onClick={() => alert("Google Pay clicked")}
            disabled={!stripe}
          >
            <img
              src="https://www.gstatic.com/marketing-cms/assets/images/f0/5d/9f4b413445c9b4a22b8b2c177cf6/google-pay.webp=n-w86-h48-fcrop64=1,00000000ffffffff-rw"
              alt="Google Pay"
              className="google-logo"
            />
            
          </button>
        </form>
      )}
    </div>
  );
};

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
