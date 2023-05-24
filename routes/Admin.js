const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  getAdminById,
  deleteAdminById,
  updateAdminById,
  uploadProfilePicture,
} = require("../controllers/Admin");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-admin/:admin_id", getAdminById);

router.delete("/delete-admin/:admin_id", deleteAdminById);

router.put("/update-admin/:admin_id", updateAdminById);

router.post("/upload-profile-picture/:admin_id", uploadProfilePicture);

module.exports = router;
