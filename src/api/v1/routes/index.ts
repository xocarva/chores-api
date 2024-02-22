import express from 'express';
import { login, register } from '../controllers';
import * as middlewares from '../../../middlewares';
import { spacesRouter } from './spaces.router';
import { MessageResponse } from '../../../interfaces';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get('/login', login);
router.post('/register', register);
router.use('/spaces', spacesRouter);
router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

export default router;
