import express from 'express';
import { createSpace, deleteSpace, getSpace, listSpaces, updateSpace } from '../controllers';

export const spacesRouter = express.Router();

spacesRouter.get('/:id', getSpace);
spacesRouter.get('/', listSpaces);
spacesRouter.post('/', createSpace);
spacesRouter.patch('/:id', updateSpace);
spacesRouter.delete('/:id', deleteSpace);
