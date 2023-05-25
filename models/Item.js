const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  is_in_need: {
    type: Boolean,
    default: false,
  },
  image: {
    url: {
      type: String,
      required: false,
      default: "",
    },
    public_id: {
      type: String,
      required: false,
      default: "",
    },
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: false,
    default: "",
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
    default: "",
  },

  // Other item fields
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
