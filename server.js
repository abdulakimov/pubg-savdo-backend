import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
config();

// Import routes
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";

// Configurations
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// User routes
app.use("/api", userRoutes);

// Product routes
app.use("/api", productRoutes);

// MongoDB connection with environment variables
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Listen on port 6000 or PORT env variable
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

