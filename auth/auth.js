import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

// Authorize user
export const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: "No authentication token, authorization denied." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res
        .status(401)
        .json({ message: "Token verification failed, authorization denied." });

    req.user = verified.id;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin authorization
export const adminAuth = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user);
    if (user.role !== "admin")
      return res
        .status(401)
        .json({ message: "Admin resources access denied." });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
