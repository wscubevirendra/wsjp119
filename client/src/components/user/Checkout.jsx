'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { client } from '@/utils/helper';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


export default function Checkout({ user }) {
    const { error, isLoading, Razorpay } = useRazorpay();

    const cart = useSelector((store) => store.cart);
    const addresses = user.addresses || []
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [loading, setLoading] = useState(false);
    // Navigate to Profile Page
    const handleAddAddress = () => {
        router.push('/profile');
    };

    // Place Order
    const handleOrder = async () => {
        setLoading(true);

        const orderData = {
            address: addresses[selectedAddress],
            paymentMethod
        };
        try {
            const response = await client.post("order/create", orderData);
            if (paymentMethod == "cod") {
                if (response.data.success) {

                    router.push(`/thank-you?orderId=${response.data.orderId}`);
                }
            } else {
                console.log(response.data)
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    currency: "INR",
                    name: "Ishop Company",
                    description: "Test Transaction",
                    order_id: response.data.payment_order_Id, // Generate order_id on server
                    handler: async (response) => {
                        try {
                            const verifyRespose = await client.post("order/verify", response);
                            console.log(verifyRespose)

                        } catch (error) {

                        }

                    },
                    prefill: {
                        name: user.name ?? "John Doe",
                        email: user.email,
                        contact: "9166362194",
                    },
                    theme: {
                        color: "#F37254",
                    },
                };

                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="md:col-span-2 space-y-6">

                    {/* ADDRESS SELECTION */}
                    <div className="bg-white p-5 rounded-2xl shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Select Address</h2>
                            <button
                                onClick={handleAddAddress}
                                className="text-sm bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-600"
                            >
                                + Add New
                            </button>
                        </div>

                        <div className="space-y-3">
                            {addresses.map((addr, index) => (
                                <label key={index} onClick={() => setSelectedAddress(index)} className="flex gap-3 border p-3 rounded-lg cursor-pointer">

                                    {addr.fullName} {addr.addressLine}, {addr.city}, {addr.state} {addr.pincode} | {addr.mobile}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* PAYMENT */}
                    <div className="bg-white p-5 rounded-2xl shadow">
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                                <input
                                    type="radio"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                Cash on Delivery
                            </label>

                            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                                <input
                                    type="radio"
                                    checked={paymentMethod === 'online'}
                                    onChange={() => setPaymentMethod('online')}
                                />
                                Online Payment (UPI / Card / Net Banking)
                            </label>
                        </div>
                    </div>

                </div>

                {/* RIGHT */}
                <div className="bg-white p-5 rounded-2xl shadow h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                    <div className="border-t my-4"></div>

                    <div className="flex justify-between text-sm">
                        <span>Original total</span>
                        <span>₹{cart.original_total}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Saving</span>
                        <span>${(cart.original_total) - (cart.final_total)}</span>
                    </div>

                    <div className="border-t my-3"></div>

                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>₹{cart.final_total}</span>
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleOrder}
                        className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                    >
                        {loading ? 'Placing Order...' : 'Order Now'}
                    </button>
                </div>

            </div>
        </div>
    );
}
