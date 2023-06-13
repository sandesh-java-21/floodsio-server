const Donor = require("../models/Donor");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const Rider = require("../models/Rider");

const saveDonorNotificationToken = async (req, res) => {
  try {
    var donor_id = req.params.donor_id;
    var { token } = req.body;

    console.log("donor id: ", donor_id);

    if (!donor_id || donor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var filter = {
        _id: donor_id,
      };

      var updatedData = {
        notification_token: token,
      };

      var donor = await Donor.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onDonorUpdate) => {
          console.log("on donor update: ", onDonorUpdate);
          res.json({
            message: "Notification token saved!",
            status: "200",
            token: onDonorUpdate.notification_token,
            donor: onDonorUpdate,
          });
        })
        .catch((onDonorUpdateError) => {
          console.log("on donor update error: ", onDonorUpdateError);
          res.json({
            message:
              "Donor not found or something went wrong while saving notification token!",
            status: "400",
            error: onDonorUpdateError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const saveVendorNotificationToken = async (req, res) => {
  try {
    var vendor_id = req.params.vendor_id;
    var { token } = req.body;

    if (!vendor_id || vendor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var filter = {
        _id: vendor_id,
      };

      var updatedData = {
        notification_token: token,
      };

      var vendor = await Vendor.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onDonorUpdate) => {
          console.log("on vendor update: ", onDonorUpdate);
          res.json({
            message: "Notification token saved!",
            status: "200",
            token: onDonorUpdate.notification_token,
            vendor: onDonorUpdate,
          });
        })
        .catch((onDonorUpdateError) => {
          console.log("on vendor update error: ", onDonorUpdateError);
          res.json({
            message:
              "Vendor not found or something went wrong while saving notification token!",
            status: "400",
            error: onDonorUpdateError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const saveAdminNotificationToken = async (req, res) => {
  try {
    var admin_id = req.params.admin_id;
    var { token } = req.body;

    if (!admin_id || admin_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var filter = {
        _id: admin_id,
      };

      var updatedData = {
        notification_token: token,
      };

      var admin = await Admin.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onDonorUpdate) => {
          console.log("on admin update: ", onDonorUpdate);
          res.json({
            message: "Notification token saved!",
            status: "200",
            token: onDonorUpdate.notification_token,
            admin: onDonorUpdate,
          });
        })
        .catch((onDonorUpdateError) => {
          console.log("on admin update error: ", onDonorUpdateError);
          res.json({
            message:
              "Admin not found or something went wrong while saving notification token!",
            status: "400",
            error: onDonorUpdateError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const saveRiderNotificationToken = async (req, res) => {
  try {
    var rider_id = req.params.rider_id;
    var { token } = req.body;

    if (!rider_id || rider_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var filter = {
        _id: rider_id,
      };

      var updatedData = {
        notification_token: token,
      };

      var rider = await Rider.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onDonorUpdate) => {
          console.log("on rider update: ", onDonorUpdate);
          res.json({
            message: "Notification token saved!",
            status: "200",
            token: onDonorUpdate.notification_token,
            rider: onDonorUpdate,
          });
        })
        .catch((onDonorUpdateError) => {
          console.log("on rider update error: ", onDonorUpdateError);
          res.json({
            message:
              "Rider not found or something went wrong while saving notification token!",
            status: "400",
            error: onDonorUpdateError,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const getAllVendorsNotificationToken = async (req, res) => {
  try {
    var tokens = await Vendor.find(
      {},
      {
        notification_token: 1,
      }
    )
      .then((onTokensFound) => {
        console.log("on tokens found: ", onTokensFound);
        res.json({
          message:
            onTokensFound.length <= 0 ? "No tokens found!" : "Token founds!",
          status: "200",
          tokens: onTokensFound,
        });
      })
      .catch((onTokensFoundError) => {
        console.log("on tokens found error: ", onTokensFoundError);
        res.json({
          message:
            "Something went wrong while getting vendors notification token!",
          status: "400",
          error: onTokensFoundError,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const getAllDonorsNotificationToken = async (req, res) => {
  try {
    var tokens = await Donor.find(
      {},
      {
        notification_token: 1,
      }
    )
      .then((onTokensFound) => {
        console.log("on tokens found: ", onTokensFound);
        res.json({
          message:
            onTokensFound.length <= 0 ? "No tokens found!" : "Token founds!",
          status: "200",
          tokens: onTokensFound,
        });
      })
      .catch((onTokensFoundError) => {
        console.log("on tokens found error: ", onTokensFoundError);
        res.json({
          message:
            "Something went wrong while getting vendors notification token!",
          status: "400",
          error: onTokensFoundError,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const getAllRidersNotificationToken = async (req, res) => {
  try {
    var tokens = await Rider.find(
      {},
      {
        notification_token: 1,
      }
    )
      .then((onTokensFound) => {
        console.log("on tokens found: ", onTokensFound);
        res.json({
          message:
            onTokensFound.length <= 0 ? "No tokens found!" : "Token founds!",
          status: "200",
          tokens: onTokensFound,
        });
      })
      .catch((onTokensFoundError) => {
        console.log("on tokens found error: ", onTokensFoundError);
        res.json({
          message:
            "Something went wrong while getting vendors notification token!",
          status: "400",
          error: onTokensFoundError,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const getAllAdminsNotificationToken = async (req, res) => {
  try {
    var tokens = await Admin.find(
      {},
      {
        notification_token: 1,
      }
    )
      .then((onTokensFound) => {
        console.log("on tokens found: ", onTokensFound);
        res.json({
          message:
            onTokensFound.length <= 0 ? "No tokens found!" : "Token founds!",
          status: "200",
          tokens: onTokensFound,
        });
      })
      .catch((onTokensFoundError) => {
        console.log("on tokens found error: ", onTokensFoundError);
        res.json({
          message:
            "Something went wrong while getting vendors notification token!",
          status: "400",
          error: onTokensFoundError,
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

module.exports = {
  saveDonorNotificationToken,
  saveVendorNotificationToken,
  saveAdminNotificationToken,
  saveRiderNotificationToken,
  getAllVendorsNotificationToken,
  getAllDonorsNotificationToken,
  getAllRidersNotificationToken,
  getAllAdminsNotificationToken,
};
