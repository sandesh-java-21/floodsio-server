const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

var transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = transactionModel;
