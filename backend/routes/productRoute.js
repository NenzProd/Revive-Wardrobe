import express from "express"
import { listProduct, listVisibleCategories, updateCategoryVisibility, addProduct, removeProduct, singleProduct, editProduct, updateAllProductStocks, bulkUpdateProducts, getPriceHistory } from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import { authorizeAdmin } from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post('/add', authorizeAdmin(['super_admin', 'inventory_manager']), upload.fields([{name:'image1', maxCount:1}, 
    {name:'image2', maxCount:1}, 
    {name:'image3', maxCount:1}, 
    {name:'image4', maxCount:1}]),addProduct);
productRouter.post('/remove', authorizeAdmin(['super_admin']), removeProduct);
productRouter.post('/single', singleProduct);
productRouter.put('/edit', authorizeAdmin(['super_admin', 'inventory_manager']), upload.fields([{name:'image1', maxCount:1}, {name:'image2', maxCount:1}, {name:'image3', maxCount:1}, {name:'image4', maxCount:1}]), editProduct);
productRouter.get('/list', listProduct);
productRouter.get('/categories', listVisibleCategories);
productRouter.post('/update-stocks', authorizeAdmin(['super_admin', 'inventory_manager']), updateAllProductStocks);
productRouter.post('/bulk-update', authorizeAdmin(['super_admin', 'inventory_manager']), bulkUpdateProducts);
productRouter.post('/price-history', authorizeAdmin(['super_admin', 'inventory_manager']), getPriceHistory);
productRouter.post('/categories/update', authorizeAdmin(['super_admin', 'inventory_manager']), updateCategoryVisibility);

export default productRouter;
