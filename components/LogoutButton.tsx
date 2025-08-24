"use client"
import React from 'react'
import { Button } from './ui/button'
import { logoutAction } from '@/actions/auth-actions'

const LogoutButton = () => {
    return (
        <Button size="sm" onClick={async () => await logoutAction()}>Logout</Button>
    )
}

export default LogoutButton