const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  getDonorById,
  deleteDonorById,
  updateDonorById,
} = require("../controllers/Donor");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-donor/:donor_id", getDonorById);

router.delete("/delete-donor/:donor_id", deleteDonorById);

router.put("/update-donor/:donor_id", updateDonorById);

module.exports = router;
