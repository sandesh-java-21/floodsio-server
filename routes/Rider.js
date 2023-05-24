const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  deleteRiderById,
  getRiderById,
  updateRiderById,
  uploadProfilePicture,
} = require("../controllers/Rider");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-rider/:rider_id", getRiderById);

router.delete("/delete-rider/:rider_id", deleteRiderById);

router.put("/update-rider/:rider_id", updateRiderById);

router.post("/upload-profile-picture/:rider_id", uploadProfilePicture);

module.exports = router;
