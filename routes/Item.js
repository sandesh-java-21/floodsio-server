const express = require("express");
const router = express.Router();

const {
  createItem,
  getAllItems,
  deleteItemById,
  getItemById,
  getItemsByCategory,
  getItemsByVendorId,
  addItemToNecessities,
  removeItemFromNecessities,
  getAllNecessaryItems,
  updateItemById,
  updateItemImage,
} = require("../controllers/Item");

router.post("/create-item", createItem);

router.get("/get-all-items", getAllItems);

router.get("/get-item/:item_id", getItemById);

router.get("/get-all-vendor-items/:vendor_id", getItemsByVendorId);

router.get("/get-all-items-by-category/:category_id", getItemsByCategory);

router.get("/get-all-necessary-items", getAllNecessaryItems);

router.delete("/delete-item/:item_id", deleteItemById);

router.patch("/add-item-to-necessities/:item_id", addItemToNecessities);

router.patch(
  "/remove-item-from-necessities/:item_id",
  removeItemFromNecessities
);

router.put("/update-item/:item_id", updateItemById);

router.patch("/update-item-image/:item_id", updateItemImage);

module.exports = router;
