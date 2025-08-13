import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 20 },
    phoneNumber: { type: String, required: true },
    email: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['home', 'work', 'personal'],
      required: true,
    },
    photo: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default model('Contact', contactSchema);
