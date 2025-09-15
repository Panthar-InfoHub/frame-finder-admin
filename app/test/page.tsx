import { getSession } from '@/actions/auth/session'
import { getVendorMiscById } from '@/actions/Vendor Misc/getVendorMiscById'
import React from 'react'

const page = async() => {
  const {user} = await getSession()
  const res = await getVendorMiscById(user?.id!,"shape")
  console.log(res)
  return (
    <div>{JSON.stringify(res)}</div>
  )
}

export default page