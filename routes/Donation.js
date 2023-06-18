const express = require("express");
const router = express.Router();

const {
  assignDonationToRider,
  completeDonation,
  uploadDonationEvidence,
  getDonation,
  getDonorsDonations,
  getAllDonations,
} = require("../controllers/Donation");

router.get("/get-donation/:donation_id", getDonation);

router.get("/get-donor-donations/:donor_id", getDonorsDonations);

router.get("/get-all-donations", getAllDonations);

router.post("/assign-donation-to-rider/:donation_id", assignDonationToRider);

router.post("/complete-donation/:donation_id", completeDonation);

router.patch("/upload-donation-evidence/:donation_id", uploadDonationEvidence);

module.exports = router;
