const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  deleteVendorById,
  getVendorById,
  updateVendorById,
  uploadProfilePicture,
  getAllVendors,
  getVendorAccount,
} = require("../controllers/Vendor");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-vendor/:vendor_id", getVendorById);

router.get("/get-all-vendors", getAllVendors);

router.get("/get-vendor-account/:vendor_id", getVendorAccount);

router.delete("/delete-vendor/:vendor_id", deleteVendorById);

router.put("/update-vendor/:vendor_id", updateVendorById);

router.post("/upload-profile-picture/:vendor_id", uploadProfilePicture);

module.exports = router;
