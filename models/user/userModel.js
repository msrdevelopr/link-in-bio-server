import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    username: {
      type: String,
      required: [true, 'Please choose a username'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 160,
    },
    avatar: {
      type: String,
      default: '',
    },
    verificationPin: {
      type: String,
      default: null,
    },
    pinExpiry: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetPin: {
      type: String,
      default: null,
    },
    resetPinExpiry: {
      type: Date,
      default: null,
    },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme',
      default: null,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
