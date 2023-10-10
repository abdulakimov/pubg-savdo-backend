import Product from "../models/product.model.js";

export const checkId = async(req, res, next) => {
    const id = req.params.id;

    const product = await Product.findById(id);
    
    if (!product) {
        return res.status(400).json({ message: "Product not found with this ID" });
    }
    
    next();
}