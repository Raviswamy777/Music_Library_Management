import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Album', albumSchema);
