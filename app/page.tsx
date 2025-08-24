import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex justify-center items-center h-svh bg-black text-white'>

      <div>
        <h1 className='text-2xl font-bold'>Welcome to the Frame Finder Admin</h1>
        <div className='mt-4 flex gap-2  justify-center'>
          <Link href="/register" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Sign Up</Link>
          <Link href="/login" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Sign In</Link>
          <Link href="/admin" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Admin</Link>
        </div>
      </div>
    </div>
  )
}

export default page