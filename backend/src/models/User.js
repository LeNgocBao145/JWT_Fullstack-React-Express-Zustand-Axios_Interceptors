import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // link CDN to display image
    },
    avatarId: {
      type: String, // Cloudinary public_id to delete image
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    phone: {
      type: String,
      sparse: true, // Allow null but it's unique and can't be duplicated
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
