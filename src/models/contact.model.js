import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 20 },
    phoneNumber: { type: String, required: true },
    email: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['home', 'work', 'personal', 'business', 'other'],
      required: true,
    },
    photo: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Contact = model('Contact', contactSchema);
export default Contact;
