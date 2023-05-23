const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  getAdminById,
  deleteAdminById,
  updateAdminById,
} = require("../controllers/Admin");

router.post("/sign-up", signUp);

router.post("/sign-in", login);

router.get("/get-admin/:admin_id", getAdminById);

router.delete("/delete-admin/:admin_id", deleteAdminById);

router.put("/update-admin/:admin_id", updateAdminById);

module.exports = router;
