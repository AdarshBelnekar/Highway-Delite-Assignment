import { Response } from 'express';
import Note from '../models/Notes';
import { AuthenticatedRequest } from '../middleware/authmiddleware';

export const createNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;

    if (!title || !userId) {
      res.status(400).json({ message: 'Title and user ID are required' });
      return;
    }

    const note = await Note.create({ title, content, userId });
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create note' });
  }
};


export const getNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const noteId = req.params.id;

    const deleted = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!deleted) {
      res.status(404).json({ message: 'Note not found or not yours' });
      return;
    }

    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
