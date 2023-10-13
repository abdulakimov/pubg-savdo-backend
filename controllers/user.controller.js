import Users from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userController = {
  register: async (req, res) => {
    try {
      const { username, password, email, role, phone, telegram } = req.body;

      // Validation
      if (!username || !email || !password || !phone)
        return res.status(400).json({ message: "Fill all fields." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters." });

      // Check for existing user
      const existingUserEmail = await Users.findOne({ email: email });
      const existingUserName = await Users.findOne({ username: username });
      if (existingUserEmail || existingUserName)
        return res
          .status(400)
          .json({ message: "An account with this email or username already exists." });

      // Hash password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new Users({
        username,
        password: passwordHash,
        email,
        role,
        phone,
        telegram,
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
      const { username, password } = req.body;

      // Validate
      if (!username || !password)
        return res.status(400).json({ message: "Fill all fields." });

      // Check for existing user
      const user = await Users.findOne({ username: username });
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
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUsers: async (_, res) => {
    try {
      const users = await Users.find();

      // Return all users except the password and createdAt/updatedAt and populate products

      const filteredUsers = users.map((user) => {
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          phone: user.phone,
          telegram: user.telegram,
          products: user.products,
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
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        telegram: user.telegram,
        products: user.products,
      };

      res.status(200).json(filteredUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      const checkUserName = await Users.findOne({ username: req.body.username });

      // Check if user exists
      if (!user)
        return res.status(400).json({ message: "User does not exist." });

      // Check if username is already taken
      if (checkUserName && checkUserName._id != req.params.id)
        return res
          .status(400)
          .json({ message: "An account with this username already exists." });

      // Update user
      user.username = req.body.username || user.username;
      user.phone = req.body.phone || user.phone;
      user.telegram = req.body.telegram || user.telegram;

      // Save updated user
      await user.save();

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
