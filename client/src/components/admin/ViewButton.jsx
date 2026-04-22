'use client'

import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import Image from "next/image";

export default function ViewButton({ prod, baseUrl }) {
    const [toggle, setToggle] = useState(false)

    return (
        <>
            {/* BUTTON */}
            <div
                onClick={() => setToggle(true)}
                className="p-2 rounded-lg bg-orange-100 text-[#ff7b00] hover:bg-orange-200 transition cursor-pointer"
            >
                <FaEye />
            </div>

            {/* MODAL */}
            {toggle && (
                <Overlay prod={prod} baseUrl={baseUrl} onClose={() => setToggle(false)} />
            )}
        </>
    )
}



function Overlay({ onClose, prod, baseUrl }) {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose} // outside click
        >
            {/* MODAL CARD */}
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative"
                onClick={(e) => e.stopPropagation()} // prevent close on inside click
            >
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>

                {/* CONTENT */}
                <h2 className="text-xl font-bold mb-4">Product Details</h2>

              
                    <div className="mb-4">
                        <Image
                            src={`${baseUrl}${prod.thumbnail}`}
                            alt={prod.name}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                        />
                    </div>
                

                {/* DETAILS */}
                <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Name:</span> {prod.name}</p>
                    <p><span className="font-semibold">Category:</span> {prod?.category_id?.name}</p>
                    <p><span className="font-semibold">Status:</span> {prod.status ? "Active" : "Inactive"}</p>

                    {/* optional fields */}
                    {prod.price && (
                        <p><span className="font-semibold">Price:</span> ₹{prod.price}</p>
                    )}

                    {prod.description && (
                        <p><span className="font-semibold">Description:</span> {prod.description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}