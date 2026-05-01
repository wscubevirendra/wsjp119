'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '@/utils/helper';

export default function ProfilePage({ user }) {
    console.log(user)

    const [form, setForm] = useState({
        fullName: '',
        mobile: '',
        pincode: '',
        addressLine: '',
        city: '',
        state: ''
    });


    // Handle Change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add Address
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await client.post('user/addAddress', form);
        
            setForm({
                fullName: '',
                mobile: '',
                pincode: '',
                addressLine: '',
                city: '',
                state: ''
            });
        } catch (err) {
            console.error(err);
        }
    };

  
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

                {/* FORM */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Add Address</h2>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" required />
                        <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile" className="w-full border p-2 rounded" required />
                        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border p-2 rounded" required />
                        <input name="addressLine" value={form.addressLine} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" required />
                        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" required />
                        <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="w-full border p-2 rounded" required />

                        <button className="bg-teal-500 text-white px-4 py-2 rounded">
                            Save Address
                        </button>
                    </form>
                </div>

        
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="text-xl font-semibold mb-4">My Addresses</h2>

                    <div className="space-y-3">
                        {user?.addresses.map((addr) => (
                            <div key={addr._id} className="border p-3 rounded-lg">
                                <p className="font-semibold">{addr.fullName}</p>
                                <p>{addr.addressLine}, {addr.city}, {addr.state}</p>
                                <p>{addr.pincode} | {addr.mobile}</p>

                                <button
                                  
                                    className="text-red-500 text-sm mt-2"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
}
