const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        quantity: { type: Number, required: true },
      },
    ],
    completed: { type: Boolean, default: false },
    order_status: {
      type: String,
      required: false,
      default: "PLACED",
    },
    total_amount: {
      type: Number,
      required: true,
    },
    sub_total: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: false,
      default: "NOT-PAID",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
