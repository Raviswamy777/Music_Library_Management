import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grammy: { type: Number },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Artist', artistSchema, 'artists');
