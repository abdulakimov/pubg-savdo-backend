import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { adminAuth, auth } from "../auth/auth.js";
const router = Router();

router.get("/users", userController.getUsers);
router.get("/user/:id", userController.getOnlyOneUser);
router.post("/register", userController.register);
router.put("/user/:id", auth, userController.updateUser);
router.delete("/user/:id", auth, adminAuth, userController.deleteUser);
router.post("/login", userController.login);
router.get("/logout", auth, userController.logout);

export default router;
