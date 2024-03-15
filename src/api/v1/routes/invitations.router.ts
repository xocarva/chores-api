import express from 'express';
import { createInvitation } from '../controllers';
import { isAuthorized } from '../../../middlewares';

export const invitationsRouter = express.Router();

invitationsRouter.post('/', isAuthorized, createInvitation);
