import z from 'zod';

export const invitationBodySchema = z.object({
  spaceId: z.number(),
});

export const invitationSchema = invitationBodySchema.extend({
  accepted: z.boolean(),
  token: z.string(),

});

export const partialInvitationSchema = invitationSchema.partial();
export const invitationWithIdSchema = invitationSchema.extend({ id: z.number() });
export const partialInvitationWithIdSchema = invitationWithIdSchema.partial();

export type InvitationBody = z.infer<typeof invitationBodySchema>;
export type Invitation = z.infer<typeof invitationSchema>;
export type PartialInvitation = z.infer<typeof partialInvitationSchema>;
export type InvitationWithId = z.infer<typeof invitationWithIdSchema>;
export type PartialInvitationWithId = z.infer<typeof partialInvitationWithIdSchema>;
