import Checkout from '@/components/user/Checkout'
import React from 'react'
import { getMe } from '@/api/api-call'

export default async function page() {
  const { user } = await getMe()
  return (
    <Checkout user={user} />
  )
}
