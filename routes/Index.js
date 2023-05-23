const express = require("express");
const router = express.Router();

const donorRoutes = require("../routes/Donor");
const vendorRoutes = require("../routes/Vendor");
const riderRoutes = require("../routes/Rider");
const adminRoutes = require("../routes/Admin");

router.use("/donor", donorRoutes);
router.use("/vendor", vendorRoutes);
router.use("/rider", riderRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
