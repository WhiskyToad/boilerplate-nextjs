import { NextRequest } from 'next/server'
import { withAuth, apiResponse } from '@/lib/api/middleware'

export const GET = withAuth(async (request: NextRequest, user: any) => {
  console.log('Test auth endpoint reached with user:', {
    id: user.id,
    email: user.email,
    aud: user.aud,
    exp: user.exp,
    iat: user.iat
  })
  
  return apiResponse({ 
    user: {
      id: user.id,
      email: user.email
    },
    message: 'Authentication successful' 
  })
})