import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },

    password: {
      type: String,
      required: true,
    },
    
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      default: "user",
    },

    phone: {
      type: String,
      required: true,
    },

    telegram: {
      type: String,
      default: "",
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Users", userSchema);
