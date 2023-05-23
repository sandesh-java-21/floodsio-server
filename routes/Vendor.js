const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  deleteVendorById,
  getVendorById,
  updateVendorById,
} = require("../controllers/Vendor");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-vendor/:vendor_id", getVendorById);

router.delete("/delete-vendor/:vendor_id", deleteVendorById);

router.put("/update-vendor/:vendor_id", updateVendorById);

module.exports = router;
