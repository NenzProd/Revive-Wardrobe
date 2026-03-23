import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/revivewardrobe';

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB to update product sizes...");
    
    const products = await productModel.find();
    let updatedCount = 0;
    
    for (const product of products) {
      if (product.variants && product.variants.length > 0) {
        let changed = false;
        
        // Check Name for Eternal Noir
        if (product.name.toLowerCase().includes('eternal noir')) {
           if (product.variants[0].filter_value !== 'M') {
               product.variants[0].filter_value = 'M';
               changed = true;
           }
        } else {
           if (product.variants[0].filter_value !== 'L') {
               product.variants[0].filter_value = 'L';
               changed = true;
           }
        }
        
        if (changed) {
          product.markModified('variants');
          await product.save();
          updatedCount++;
          console.log(`Updated: ${product.name} to size ${product.variants[0].filter_value}`);
        }
      }
    }
    
    console.log(`Successfully updated ${updatedCount} products!`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
