"use client"
import React from 'react'
import { Logout } from '@/actions/auth/auth-actions'
import { Button } from '@/components/ui/button'

const LogoutButton = () => {
    return (
        <Button size="sm" onClick={async () => await Logout()}>Logout</Button>
    )
}

export default LogoutButton