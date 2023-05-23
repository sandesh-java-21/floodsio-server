const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
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
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
