const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  deleteRiderById,
  getRiderById,
  updateRiderById,
} = require("../controllers/Rider");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-rider/:rider_id", getRiderById);

router.delete("/delete-rider/:rider_id", deleteRiderById);

router.put("/update-rider/:rider_id", updateRiderById);

module.exports = router;
