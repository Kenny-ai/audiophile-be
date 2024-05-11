import {
  getAllProducts,
  getCategoriesProducts,
  getCategoryIds,
  getIds,
  getProduct,
  getProductsByCategory,
} from "../controllers/products";
import { protect } from "../middleware/auth";

const express = require("express");
const product = express.Router();

product.route("/").get(getProduct);
// .post(protect, createNewBoard)
// .put(protect, updateBoard)
// .delete(protect, deleteBoard);

product.get("/all", getAllProducts);
product.get("/all/ids", getIds);
product.get("/categories", getCategoriesProducts);

product.get("/:category/ids", getCategoryIds);
product.get("/:category", getProductsByCategory);

// product.get("/:category", getAllProducts);

// product
//   .route("/tasks")
//   .get(protect, getUserTasks)
//   .post(protect, createNewTask)
//   .put(protect, updateTask)
//   .delete(protect, deleteTask);

export default product;
