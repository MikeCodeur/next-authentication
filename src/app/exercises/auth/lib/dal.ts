// eslint-disable-next-line camelcase
import {cache, experimental_taintUniqueValue} from 'react'
//import {verifySession} from './session'
//import {getUserById} from '@/db/sgbd'
import {User} from '@/lib/type'
import {UserDTO} from './type'
import {auth} from '@/auth'
import {getUserByEmail} from '@/db/sgbg-unstorage'

export const getConnectedUser = cache(async () => {
  // const session = await verifySession()
  // if (!session || !session?.isAuth) return
  const session = await auth()
  console.log('getConnectedUser auth', session)
  if (!session?.user) return

  try {
    const user = await getUserByEmail(session.user.email as string)
    console.log('getConnectedUser getUserById', session.user)
    return userDTO(user as User)
  } catch (error) {
    console.error('Failed to fetch user', error)
    return
  }
})

export function userDTO(user: User): UserDTO {
  //console.log('taintUniqueValue', typeof taintUniqueValue)
  experimental_taintUniqueValue(
    'Do not pass password to the client.',
    user,
    user?.password
  )
  // experimental_taintObjectReference(
  //   'Do not pass ALL environment variables to the client.',
  //   process.env
  // )
  return {
    email: user?.email ?? '',
    name: user?.name,
    role: user?.role,
    //password: user?.password,
  }
}
