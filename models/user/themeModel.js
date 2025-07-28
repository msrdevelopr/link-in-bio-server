import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    font: {
      type: String,
      default: 'Inter',
    },
    buttonStyle: {
      type: String,
      default: 'rounded',
    },
    colors: {
      background: {
        type: String,
        default: '#ffffff',
      },
      text: {
        type: String,
        default: '#000000',
      },
      button: {
        type: String,
        default: '#007bff',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, 
    },
  },
  { timestamps: true }
);

const Theme = mongoose.model('Theme', themeSchema);
export default Theme;
