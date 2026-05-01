// app/thank-you/page.jsx

'use client'
import { useSearchParams } from 'next/navigation'

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        
        <h1 className="text-2xl font-bold mb-2">
          🎉 Order Placed Successfully!
        </h1>

        <p className="text-gray-600">Your Order ID is:</p>

        <p className="text-xl font-semibold text-green-600 mt-2">
          {orderId || "N/A"}
        </p>

      </div>
    </div>
  )
}