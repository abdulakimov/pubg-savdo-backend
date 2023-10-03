import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { adminAuth, auth } from "../auth/auth.js";
const router = Router();

router.get("/product", productController.getProduct);
router.post("/product", productController.createProduct);
router.put("/product/:id", productController.updateProduct);
router.delete("/product/:id", productController.deleteProduct);

export default router;
