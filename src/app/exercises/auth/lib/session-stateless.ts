import 'server-only'

import {cookies} from 'next/headers'

import {EXPIRE_TIME, decrypt, encrypt} from './crypt'
import {getUserById} from '@/db/sgbg-unstorage'

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + EXPIRE_TIME)
  const user = await getUserById(userId)
  const session = await encrypt({userId, expiresAt, role: user?.role})

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession() {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)
  console.log('verifySession cookie', cookie, session)

  if (!session || !session.userId) {
    console.log('verifySession No session found')
    return
  }

  return {isAuth: true, userId: session.userId, role: session.role}
}

export function deleteSession() {
  cookies().delete('session')
}

export async function updateSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return
  }

  //const expires = new Date(Date.now() + EXPIRE_TIME)
  // cookies().set('session', session, {
  //   httpOnly: true,
  //   secure: true,
  //   expires,
  //   sameSite: 'lax',
  //   path: '/',
  // })
}
