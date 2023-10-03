import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
const router = Router();

router.get("/user", userController.getUser);
router.post("/register", userController.registerUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

export default router;
