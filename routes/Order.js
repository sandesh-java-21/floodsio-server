const express = require("express");
const router = express.Router();

const {
  createOrder,
  updateOrderPaymentStatus,
  updateOrderStatus,
  getOrder,
  getAllVendorOrders,
  getAllDonorOrders,
} = require("../controllers/Order");

router.get("/get-order/:order_id", getOrder);

router.get("/get-vendor-orders/:vendor_id", getAllVendorOrders);

router.get("/get-donor-orders/:donor_id", getAllDonorOrders);

router.post("/create-order", createOrder);

router.patch("/update-order-status/:order_id", updateOrderStatus);

router.patch(
  "/update-order-payment-status/:order_id",
  updateOrderPaymentStatus
);

module.exports = router;
