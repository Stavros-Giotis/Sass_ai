import React from 'react'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { db } from '~/server/db'

const SyncUuer = async() => {
    const {userId} = await auth()
    if(!userId){
        throw new Error("User not found")
    }
    
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if(!user.emailAddresses[0]?.emailAddress){
        return notFound
    }
    
    await db.user.upsert({
        where: {
            emailAddress: user.emailAddresses[0]?.emailAddress?? ""
        },
        update: {
            importUrl : user.imageUrl, 
            firstName :user.firstName,
            lastName : user.lastName
            
        },
        create: {
            id: userId,
            emailAddress: user.emailAddresses[0]?.emailAddress?? "",
            importUrl : user.imageUrl, 
            firstName : user.firstName,
            lastName : user.lastName
        }
    })
}
export default SyncUuer