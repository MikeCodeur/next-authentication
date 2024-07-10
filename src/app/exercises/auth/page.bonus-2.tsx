//2. 🚀 DAL et DTO Pattern (Data Tranform Object)
import {Label} from '@/components/ui/label'
import {verifySession} from './lib/session-stateless'
import {getUserById} from '@/db/sgbd'
import {cache} from 'react'
import {RoleEnum, User} from '@/lib/type'

async function Page() {
  const user = await getConnectedUser()
  console.log('Page : user', user)
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 text-center text-lg">
      {user ? (
        <Label>Hello {user.email}</Label>
      ) : (
        <Label>You are not connected</Label>
      )}
    </div>
  )
}
export default Page

export const getConnectedUser = cache(async () => {
  const session = await verifySession()
  if (!session || !session?.isAuth) return
  console.log('getConnectedUser', session)
  try {
    const user = await getUserById(session.userId as string)
    return userDTO(user as User)
  } catch (error) {
    console.error('Failed to fetch user', error)
    return
  }
})

export function userDTO(user: User): UserDTO {
  return {
    email: user?.email ?? '',
    name: user?.name,
    role: user?.role,
    //password: user?.password,
  }
}

export type UserDTO = {
  email: string
  name?: string
  role?: RoleEnum
  password?: string
}
