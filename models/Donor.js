const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  full_name: { type: String, required: false, default: "" },
  email_address: { type: String, required: false, default: "" },
  password: { type: String, required: false, default: "" },
  profile_picture: {
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
  cnic: { type: String, required: false, default: "" },
  notification_token: {
    type: String,
    required: false,
    default: "",
  },
  is_verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  gender: {
    type: String,
    required: false,
    default: "",
  },
  phone_no: {
    type: String,
    required: false,
    default: "",
  },

  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
  cart: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number, default: 1 },
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    },
  ],
});

// Function to check if an item with a different vendor already exists in the cart
donorSchema.methods.itemExistsWithDifferentVendor = function (
  itemId,
  vendorId
) {
  return this.cart.some((cartItem) => {
    return cartItem.item.equals(itemId) && !cartItem.vendor.equals(vendorId);
  });
};

// Add item to cart with vendor validation
donorSchema.methods.addToCart = function (itemId, quantity, vendorId) {
  if (this.itemExistsWithDifferentVendor(itemId, vendorId)) {
    return "Cannot add items from multiple vendors to the cart.";
  }

  this.cart.push({ item: itemId, quantity, vendor: vendorId });
  return "Item added to cart successfully.";
};

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;
