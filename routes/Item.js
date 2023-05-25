const express = require("express");
const router = express.Router();

const {
  createItem,
  getAllItems,
  deleteItemById,
  getItemById,
  getItemsByCategory,
  getItemsByVendorId,
} = require("../controllers/Item");

router.post("/create-item", createItem);

router.get("/get-all-items", getAllItems);

router.get("/get-item/:item_id", getItemById);

router.get("/get-all-vendor-items/:vendor_id", getItemsByVendorId);

router.get("/get-all-items-by-category/:category_id", getItemsByCategory);

router.delete("/delete-item/:item_id", deleteItemById);

module.exports = router;
