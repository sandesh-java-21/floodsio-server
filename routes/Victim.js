const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  deleteVictimById,
  getVictimById,
  updateVictimById,
  uploadProfilePicture,
} = require("../controllers/Victim");

router.post("/create-victim", signUp);

// router.post("/sign-in", login);

router.get("/get-victim/:victim_id", getVictimById);

router.delete("/delete-victim/:victim_id", deleteVictimById);

router.put("/update-victim/:victim_id", updateVictimById);

router.post("/upload-profile-picture/:victim_id", uploadProfilePicture);

module.exports = router;
