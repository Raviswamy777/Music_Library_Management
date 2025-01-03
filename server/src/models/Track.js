import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Track', trackSchema, "tracks");
