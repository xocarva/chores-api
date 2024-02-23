import z from 'zod';
import { partialUserWithIdSchema } from './user.schemas';

export const taskSchema = z.object({
  title: z.string(),
  date: z.date().optional(),
  completed: z.boolean(),
  spaceId: z.number(),
  users: z.array(partialUserWithIdSchema),
});

export const partialTaskSchema = taskSchema.partial();
export const taskWithIdSchema = taskSchema.extend({ id: z.number() });
export const partialTaskWithIdSchema = taskWithIdSchema.partial();

export type Task = z.infer<typeof taskSchema>;
export type PartialTask = z.infer<typeof partialTaskSchema>;
export type TaskWithId = z.infer<typeof taskWithIdSchema>;
export type PartialTaskWithId = z.infer<typeof partialTaskWithIdSchema>;
