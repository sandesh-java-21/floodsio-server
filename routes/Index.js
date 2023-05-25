const express = require("express");
const router = express.Router();

const donorRoutes = require("../routes/Donor");
const vendorRoutes = require("../routes/Vendor");
const riderRoutes = require("../routes/Rider");
const adminRoutes = require("../routes/Admin");
const itemRoutes = require("../routes/Item");
const categoryRoutes = require("../routes/Category");

router.use("/donor", donorRoutes);
router.use("/vendor", vendorRoutes);
router.use("/rider", riderRoutes);
router.use("/admin", adminRoutes);
router.use("/item", itemRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
