import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    text: true,
  },

  image: {
    type: Object,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    maxLength: 2000,
    text: true,
  },

  price: {
    type: Number,
    required: true,
    trim: true,
    maxLength: 32,
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Products", productSchema);
