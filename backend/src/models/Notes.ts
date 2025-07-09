import mongoose, { Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content?: string;
  userId: mongoose.Types.ObjectId;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    title: { type: String, required: true },
    content: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>('Note', noteSchema);
export default Note;
