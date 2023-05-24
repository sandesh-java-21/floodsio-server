const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  getDonorById,
  deleteDonorById,
  updateDonorById,
  uploadProfilePicture,
} = require("../controllers/Donor");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-donor/:donor_id", getDonorById);

router.delete("/delete-donor/:donor_id", deleteDonorById);

router.put("/update-donor/:donor_id", updateDonorById);

router.post("/upload-profile-picture/:donor_id", uploadProfilePicture);

module.exports = router;
