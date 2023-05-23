const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  picture: { type: String },
  // Other item fields
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
