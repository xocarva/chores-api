import z from 'zod';
import { partialUserWithIdSchema } from './user.schemas';

export const taskSchema = z.object({
  title: z.string(),
  completed: z.boolean().optional(),
  description: z.string().optional().nullable(),
  spaceId: z.number(),
  users: z.array(partialUserWithIdSchema),
  date: z.union([
    z.preprocess((arg) => {
      if (typeof arg === 'string' && arg !== '') {
        const parsedDate = new Date(arg);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
      return arg;
    }, z.date()),
    z.null(),
  ]).optional(),
});

export const partialTaskSchema = taskSchema.partial();
export const taskWithIdSchema = taskSchema.extend({ id: z.number() });
export const partialTaskWithIdSchema = taskWithIdSchema.partial();

export type Task = z.infer<typeof taskSchema>;
export type PartialTask = z.infer<typeof partialTaskSchema>;
export type TaskWithId = z.infer<typeof taskWithIdSchema>;
export type PartialTaskWithId = z.infer<typeof partialTaskWithIdSchema>;
