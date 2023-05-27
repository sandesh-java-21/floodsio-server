const mongoose = require("mongoose");

const victimSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: false,
    default: "",
  },
});

const Victim = mongoose.model("Victim", victimSchema);

module.exports = Victim;
