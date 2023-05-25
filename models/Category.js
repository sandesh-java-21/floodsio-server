const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
    required: true,
  },
  description: {
    type: String,
    default: "",
    required: true,
  },
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
