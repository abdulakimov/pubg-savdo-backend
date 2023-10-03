import Users from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      // Validation
      if (!name || !email || !password || !phone)
        return res.status(400).json({ message: "Please fill all fields." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters." });

      // Check for existing user
      const existingUser = await Users.findOne({ email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ message: "An account with this email already exists." });

      // Hash password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
        phone,
      });

      // Save user to database
      const savedUser = await newUser.save();

      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate
      if (!email || !password)
        return res.status(400).json({ message: "Please fill all fields." });

      // Check for existing user
      const user = await Users.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ message: "No account with this email has been registered." });

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Password is not correct" });

      // Create token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // Send token in HTTP-only cookie
      res.cookie("token", token, { httpOnly: true });

      res.status(200).json({
        token,
        message: "Logged in successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await Users.find();

      // Return all users except the password and createdAt/updatedAt and populate products

      const filteredUsers = users.map((user) => {
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          products: user.products,
          telegram: user.telegram,
        };
      });

      res.status(200).json(filteredUsers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOnlyOneUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);

      // Check if user exists
      if (!user)
        return res.status(400).json({ message: "User does not exist." });

      // Return user except the password and createdAt/updatedAt
      const filteredUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        products: user.products,
        telegram: user.telegram,
      };

      res.status(200).json(filteredUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);

      // Check if user exists
      if (!user)
        return res.status(400).json({ message: "User does not exist." });

      // Update user
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.telegram = req.body.telegram || user.telegram;

      // Save updated user
      const updatedUser = await user.save();

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deletedUser = await Users.findByIdAndDelete(req.params.id);
      // Check if user exists
      if (!deletedUser)
        return res.status(400).json({ message: "User does not exist." });

      res
        .status(200)
        .json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
