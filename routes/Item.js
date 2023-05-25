const express = require("express");
const router = express.Router();

const { createItem } = require("../controllers/Item");

router.post("/create-item", createItem);

module.exports = router;
