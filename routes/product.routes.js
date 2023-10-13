import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { adminAuth, auth } from "../auth/auth.js";
import { checkId } from "../middleware/check-id.middleware.js";
const router = Router();

router.get("/product/:id", checkId, productController.getProductOnly);
router.get("/products", productController.getProductAll)
router.post("/product", auth, productController.createProduct);
router.patch("/product/:id", auth, checkId, productController.updateProduct);
router.delete("/product/:id", auth, checkId, productController.deleteProduct);

export default router;
 