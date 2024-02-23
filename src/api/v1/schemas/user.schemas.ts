import z from 'zod';

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  admin: z.boolean().optional(),
});

export const partialUserSchema = userSchema.partial();
export const credentialsSchema = userSchema.extend({ name: z.string().optional() });
export const userWithIdSchema = userSchema.extend({ id: z.number() });
export const partialUserWithIdSchema = userWithIdSchema.partial();

export type User = z.infer<typeof userSchema>;
export type Credentials = z.infer<typeof credentialsSchema>;
export type PartialUser = z.infer<typeof partialUserSchema>;
export type UserWithId = z.infer<typeof userWithIdSchema>;
export type PartialUserWithId = z.infer<typeof partialUserWithIdSchema>;
