import z from 'zod';
import { partialUserWithIdSchema } from './user.schemas';

export const spaceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  users: z.array(partialUserWithIdSchema),
});

export const partialSpaceSchema = spaceSchema.partial();
export const spaceWithIdSchema = spaceSchema.extend({ id: z.number() });
export const partialSpaceWithIdSchema = spaceWithIdSchema.partial();

export type Space = z.infer<typeof spaceSchema>;
export type PartialSpace = z.infer<typeof partialSpaceSchema>;
export type SpaceWithId = z.infer<typeof spaceWithIdSchema>;
export type PartialSpaceWithId = z.infer<typeof partialSpaceWithIdSchema>;
