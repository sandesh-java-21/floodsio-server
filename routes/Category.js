const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} = require("../controllers/Category");

router.post("/create-category", createCategory);

router.get("/get-all-categories", getAllCategories);

router.get("/get-category/:category_id", getCategoryById);

router.put("/update-category/:category_id", updateCategoryById);

module.exports = router;
