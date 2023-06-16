const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  account_number: { type: String, required: false },
  account_holder_name: { type: String, required: false },
  current_balance: {
    type: Number,
    required: false,
    default: 0,
  },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }], // Reference to the transactions associated with the account
});

var accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
