const express = require("express");
const router = express.Router();

const forgotPasswordControllers = require("../controllers/ForgotPassword");

router.post("/check-donor-email", forgotPasswordControllers.checkDonorEmail);
router.post("/check-vendor-email", forgotPasswordControllers.checkVendorEmail);
router.post("/check-admin-email", forgotPasswordControllers.checkAdminEmail);
router.post("/check-rider-email", forgotPasswordControllers.checkRiderEmail);

router.post(
  "/send-forgot-password-otp-email/:email",
  forgotPasswordControllers.sendForgotPasswordOtpEmail
);

router.post(
  "/verify-forgot-password-otp/:email_address",
  forgotPasswordControllers.verifyForgotPasswordOtp
);

router.patch(
  "/update-donor-pasword/:email_address",
  forgotPasswordControllers.updateDonorPassword
);

router.patch(
  "/update-vendor-pasword/:email_address",
  forgotPasswordControllers.updateVendorPassword
);

router.patch(
  "/update-admin-pasword/:email_address",
  forgotPasswordControllers.updateAdminPassword
);

router.patch(
  "/update-rider-pasword/:email_address",
  forgotPasswordControllers.updateRiderPassword
);

module.exports = router;
