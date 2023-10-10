import Products from "../models/product.model.js";
import User from "../models/user.model.js";

export const productController = {
  getProductOnly: async (req, res) => {
    try {
      const id = req.params.id;
    
      // Use the select method to exclude the __v field from the query results
      const product = await Products.findById(id).select('-__v');
    
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    
  },

  createProduct: async (req, res) => {
    try {
      const { title, image, description, price, seller } = req.body;
      const user = req.user;
  
      // Create a new product
      const product = await Products.create({
        title,
        image,
        description,
        price,
        seller: user,
      });
  
      // Check if product creation was successful
      if (product) {
        // Update the seller's products array with the new product's ID
        await User.findByIdAndUpdate(
          user,
          { $push: { products: product._id } },
          { new: true }
        );
  
        res.status(201).json({ message: "Product created" });
      } else {
        res.status(400).json({ message: "Failed to create product" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      console.log(req.params.id);
      const id = req.params.id;
      const { title, image, description, price } = req.body;

      await Products.findByIdAndUpdate(
        id,
        {
          title,
          image,
          description,
          price,
        },
        { new: true }
      );

      res.status(204).json({ message: "Product updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;

      await Products.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Product deleted" });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  

  getProductAll: async (_, res) => {
    try {
      const allProducts  = await Products.find().select('-__v');

      res.status(200).json(allProducts)

    } catch (error) {
      res.status(error.status).json({ message: error.message })
    }
  },  
};
