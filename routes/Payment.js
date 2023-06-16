const express = require("express");
const router = express.Router();

const { makeOrderPayment } = require("../controllers/Account");

router.post("/make-order-payment/:account_id", makeOrderPayment);

module.exports = router;
