import {RoleEnum} from '@/lib/type'
import {z} from 'zod'

export type SessionPayload = {
  userId?: string | number //used for simple session
  sessionId?: string //used for multisession db
  expiresAt: Date
}

export interface SignInError {
  type: 'CredentialsSignin'
  message?: string
}

export type UserDTO = {
  email: string
  name?: string
  role?: RoleEnum
  password?: string
}

export const SignupFormSchema = z
  .object({
    email: z.string().email({message: 'Please enter a valid email.'}).trim(),
    password: z
      .string()
      .min(4, {message: 'Be at least 4 characters long'})
      .regex(/[A-Za-z]/, {message: 'Contain at least one letter.'})
      .regex(/\d/, {message: 'Contain at least one number.'})
      // .regex(/[^\dA-Za-z]/, {
      //   message: 'Contain at least one special character.',
      // })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    }
  )
export const LoginFormSchema = z.object({
  email: z.string().email({message: 'Please enter a valid email.'}),
  password: z.string().min(1, {message: 'Password field must not be empty.'}),
})

export const ChangeRoleSchema = z.object({
  role: z.nativeEnum(RoleEnum, {
    message: 'Role must be a valid RoleEnum value',
  }),
})
export const ChangeUserRoleSchema = z.object({
  email: z.string().email({message: 'Please enter a valid email.'}),
  role: z.nativeEnum(RoleEnum, {
    message: 'Role must be a valid RoleEnum value',
  }),
})
//export type FormSchemaType = z.infer<typeof SignupFormSchema>