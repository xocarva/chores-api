import express from 'express';
import { createInvitation, acceptInvitation } from '../controllers';
import { isAuthorized } from '../../../middlewares';

export const invitationsRouter = express.Router();

invitationsRouter.post('/', isAuthorized, createInvitation);
invitationsRouter.post('/:token/accept', isAuthorized, acceptInvitation);