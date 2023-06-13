const express = require("express");
const router = express.Router();

const {
  getAllAdminsNotificationToken,
  getAllDonorsNotificationToken,
  getAllRidersNotificationToken,
  getAllVendorsNotificationToken,
  saveAdminNotificationToken,
  saveDonorNotificationToken,
  saveRiderNotificationToken,
  saveVendorNotificationToken,
} = require("../controllers/Notifications");

router.get(
  "/get-all-vendor-notification-tokens",
  getAllVendorsNotificationToken
);

router.get("/get-all-donor-notification-tokens", getAllDonorsNotificationToken);

router.get("/get-all-admin-notification-tokens", getAllAdminsNotificationToken);

router.get("/get-all-rider-notification-tokens", getAllRidersNotificationToken);

router.post(
  "/save-vendor-notification-token/:vendor_id",
  saveVendorNotificationToken
);

router.post(
  "/save-donor-notification-token/:donor_id",
  saveDonorNotificationToken
);

router.post(
  "/save-admin-notification-token/:admin_id",
  saveAdminNotificationToken
);

router.post(
  "/save-rider-notification-token/:rider_id",
  saveRiderNotificationToken
);

module.exports = router;
