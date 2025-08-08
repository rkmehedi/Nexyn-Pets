import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Spinner } from 'flowbite-react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const CheckoutForm = ({ campaign, donationAmount, clientSecret, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            setProcessing(false);
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) {
            setProcessing(false);
            return;
        }

        const { error: paymentMethodError } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (paymentMethodError) {
            toast.error(paymentMethodError.message);
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: user?.email || 'anonymous',
                    name: user?.displayName || 'anonymous',
                },
            },
        });

        if (confirmError) {
            toast.error(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            
            const paymentData = {
                donationAmount: parseFloat(donationAmount),
                donatorName: user.displayName,
                donatorEmail: user.email,
            };

            await axiosSecure.patch(`/donations/${campaign._id}`, paymentData);
            
            setProcessing(false);
            Swal.fire({
                title: 'Thank You!',
                text: 'Your donation has been processed successfully.',
                icon: 'success',
            }).then(() => {
                onPaymentSuccess();
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            <Button type="submit" disabled={!stripe || !clientSecret || processing} className="w-full mt-6 bg-[var(--color-accent)]">
                {processing ? <Spinner /> : `Pay $${donationAmount}`}
            </Button>
        </form>
    );
};

export default CheckoutForm;
