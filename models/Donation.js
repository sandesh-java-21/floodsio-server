const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  rider: { type: mongoose.Schema.Types.ObjectId, ref: "Rider" },
  victim: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Victim",
    default: null,
  },
  completed: { type: Boolean, default: false },
  evidencePicture: { type: String },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number, required: true },
    },
  ],
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
