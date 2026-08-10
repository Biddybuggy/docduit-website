import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/**
 * Structural gate for the ID token before it reaches the crypto. Verification
 * still happens in `verifyFirebaseIdToken`; this only rejects obvious junk so a
 * malformed body never turns into a JWKS fetch.
 */
export const firebaseIdTokenSchema = z.object({
  idToken: z
    .string()
    .trim()
    .min(64, 'Malformed token.')
    .max(4096, 'Malformed token.')
    .regex(
      /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
      'Malformed token.',
    ),
});

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address.')
  .max(320, 'Enter a valid email address.');

export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
  .max(MAX_PASSWORD_LENGTH, 'Password is too long.');

export const signInSchema = z.object({
  email: emailSchema,
  // Deliberately not `passwordSchema`: an existing password predating the
  // current policy must still be able to sign in.
  password: z.string().min(1, 'Enter your password.'),
});

export const signUpSchema = z
  .object({
    fullname: z.string().trim().min(1, 'Enter your name.').max(100, 'Name is too long.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
