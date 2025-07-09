import express from 'express';
import { createNote, getNotes, deleteNote } from '../controller/noteController';
import authenticateJWT from '../middleware/authmiddleware';

const router = express.Router();

router.post('/', authenticateJWT, createNote);
router.get('/', authenticateJWT, getNotes);
router.delete('/:id', authenticateJWT, deleteNote);

export default router;
