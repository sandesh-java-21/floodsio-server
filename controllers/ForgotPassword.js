const Donor = require("../models/Donor");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const Rider = require("../models/Rider");

const OTP = require("../models/OTP");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const { sendOTPByEmail } = require("../utils/Basic");

const checkDonorEmail = async (req, res) => {
  try {
    var { email } = req.body;
    console.log(email);
    if (!email || email === "") {
      res.json({
        message: "Please provide email address!",
        status: "400",
      });
    } else {
      var searchedUser = await Donor.find(
        {
          email_address: email,
        },
        {
          password: 0,
        }
      );

      if (!searchedUser || searchedUser.length <= 0) {
        res.json({
          message: "No donor found with provided email address!",
          status: "404",
        });
      } else {
        res.json({
          success: true,
          message: "Donor found with provided email address!",
          donor: searchedUser[0],
          email: searchedUser[0].email_address,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const checkVendorEmail = async (req, res) => {
  try {
    var { email } = req.body;
    console.log(email);
    if (!email || email === "") {
      res.json({
        message: "Please provide email address!",
        status: "400",
      });
    } else {
      var searchedUser = await Vendor.find(
        {
          email_address: email,
        },
        {
          password: 0,
        }
      );

      if (!searchedUser || searchedUser.length <= 0) {
        res.json({
          message: "No vendor found with provided email address!",
          status: "404",
        });
      } else {
        res.json({
          success: true,
          message: "Vendor found with provided email address!",
          vendor: searchedUser[0],
          email: searchedUser[0].email_address,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const checkAdminEmail = async (req, res) => {
  try {
    var { email } = req.body;
    console.log(email);
    if (!email || email === "") {
      res.json({
        message: "Please provide email address!",
        status: "400",
      });
    } else {
      var searchedUser = await Admin.find(
        {
          email_address: email,
        },
        {
          password: 0,
        }
      );

      if (!searchedUser || searchedUser.length <= 0) {
        res.json({
          message: "No admin found with provided email address!",
          status: "404",
        });
      } else {
        res.json({
          success: true,
          message: "Admin found with provided email address!",
          admin: searchedUser[0],
          email: searchedUser[0].email_address,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const checkRiderEmail = async (req, res) => {
  try {
    var { email } = req.body;
    console.log(email);
    if (!email || email === "") {
      res.json({
        message: "Please provide email address!",
        status: "400",
      });
    } else {
      var searchedUser = await Rider.find(
        {
          email_address: email,
        },
        {
          password: 0,
        }
      );

      if (!searchedUser || searchedUser.length <= 0) {
        res.json({
          message: "No rider found with provided email address!",
          status: "404",
        });
      } else {
        res.json({
          success: true,
          message: "Rider found with provided email address!",
          rider: searchedUser[0],
          email: searchedUser[0].email_address,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const sendForgotPasswordOtpEmail = async (req, res) => {
  try {
    var email = req.params.email;

    sendOTPByEmail(email)
      .then((onOtpSent) => {
        console.log("on otp sent: ", onOtpSent);

        var otpObj = new OTP({
          email: email,
          otp_code: onOtpSent,
        });

        otpObj
          .save()
          .then((onOtpSaved) => {
            console.log("on otp saved: ", onOtpSaved);
            res.json({
              message: "OTP Sent Successfully!",
              status: "200",
            });
          })
          .catch((onOtpSavedError) => {
            console.log("on otp saved error: ", onOtpSavedError);
            res.json({
              message: "Something wentw wrong while saving otp!",
              status: "400",
              error: onOtpSavedError,
            });
          });
      })
      .catch((onOtpSentError) => {
        console.log("on otp sent error: ", onOtpSentError);
        res.json({
          message: "Something went wrong while sending otp!",
          status: "400",
          error: onOtpSentError,
        });
      });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    var email_address = req.params.email_address;
    var { otp_code } = req.body;

    if (!email_address || email_address === "") {
      res.json({
        message: "Email address not sent!",
        status: "400",
      });
    } else {
      var otp = await OTP.findOne({
        email: email_address,
      })
        .then(async (onOtpFound) => {
          var otpObj = onOtpFound;

          if (otpObj.email === email_address && otpObj.otp_code === otp_code) {
            var deletedOtp = await OTP.findOneAndDelete({
              email: email_address,
            })
              .then(async (onOtpDelete) => {
                res.json({
                  message: "OTP Verified!",
                  status: "200",
                });
              })
              .catch((onOtpNotDelete) => {
                res.json({
                  message: "OTP Not Verified!",
                  status: "400",
                  error: onOtpNotDelete,
                });
              });
          } else {
            res.json({
              message: "OTP Not Verified!",
              status: "400",
            });
          }
        })
        .catch((onOtpNotFound) => {
          res.json({
            message: "OTP not sent yet or has been expired!",
            status: "404",
            error: onOtpNotFound,
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

const updateDonorPassword = async (req, res) => {
  try {
    var email_address = req.params.email_address;

    var { password, confirm_password } = req.body;

    if (!password || !confirm_password) {
      res.json({
        success: false,
        message: "Required fields are empty!",
      });
    } else {
      if (
        password === "" ||
        confirm_password === "" ||
        password === " " ||
        confirm_password === " "
      ) {
        res.json({
          success: false,
          message: "Password and confirm password can not contain space!",
        });
      } else {
        if (password == confirm_password) {
          var filter = {
            email_address: email_address,
          };

          var salt = bcrypt.genSaltSync(10);
          var encryptPassword = bcrypt.hashSync(password, salt);
          console.log("Encrypted: ", encryptPassword);

          var update = {
            password: encryptPassword,
          };
          var searchedUser = await Donor.findOneAndUpdate(filter, update, {
            new: true,
          })
            .then((result) => {
              res.json({
                result: result,
                message: "Password Updated Successfully!",
                status: "200",
                success: true,
              });
            })

            .catch((error) => {
              res.json({
                error,
                message: "Can not update password",
                status: "400",
                success: false,
              });
            });
        } else {
          res.send("Password and confirm password should be same!");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const updateVendorPassword = async (req, res) => {
  try {
    var email_address = req.params.email_address;

    var { password, confirm_password } = req.body;

    if (!password || !confirm_password) {
      res.json({
        success: false,
        message: "Required fields are empty!",
      });
    } else {
      if (
        password === "" ||
        confirm_password === "" ||
        password === " " ||
        confirm_password === " "
      ) {
        res.json({
          success: false,
          message: "Password and confirm password can not contain space!",
        });
      } else {
        if (password == confirm_password) {
          var filter = {
            email_address: email_address,
          };

          var salt = bcrypt.genSaltSync(10);
          var encryptPassword = bcrypt.hashSync(password, salt);
          console.log("Encrypted: ", encryptPassword);

          var update = {
            password: encryptPassword,
          };
          var searchedUser = await Vendor.findOneAndUpdate(filter, update, {
            new: true,
          })
            .then((result) => {
              res.json({
                result: result,
                message: "Password Updated Successfully!",
                status: "200",
                success: true,
              });
            })

            .catch((error) => {
              res.json({
                error,
                message: "Can not update password",
                status: "400",
                success: false,
              });
            });
        } else {
          res.send("Password and confirm password should be same!");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    var email_address = req.params.email_address;

    var { password, confirm_password } = req.body;

    if (!password || !confirm_password) {
      res.json({
        success: false,
        message: "Required fields are empty!",
      });
    } else {
      if (
        password === "" ||
        confirm_password === "" ||
        password === " " ||
        confirm_password === " "
      ) {
        res.json({
          success: false,
          message: "Password and confirm password can not contain space!",
        });
      } else {
        if (password == confirm_password) {
          var filter = {
            email_address: email_address,
          };

          var salt = bcrypt.genSaltSync(10);
          var encryptPassword = bcrypt.hashSync(password, salt);
          console.log("Encrypted: ", encryptPassword);

          var update = {
            password: encryptPassword,
          };
          var searchedUser = await Admin.findOneAndUpdate(filter, update, {
            new: true,
          })
            .then((result) => {
              res.json({
                result: result,
                message: "Admin Updated Successfully!",
                status: "200",
                success: true,
              });
            })

            .catch((error) => {
              res.json({
                error,
                message: "Can not update password",
                status: "400",
                success: false,
              });
            });
        } else {
          res.send("Password and confirm password should be same!");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const updateRiderPassword = async (req, res) => {
  try {
    var email_address = req.params.email_address;

    var { password, confirm_password } = req.body;

    if (!password || !confirm_password) {
      res.json({
        success: false,
        message: "Required fields are empty!",
      });
    } else {
      if (
        password === "" ||
        confirm_password === "" ||
        password === " " ||
        confirm_password === " "
      ) {
        res.json({
          success: false,
          message: "Password and confirm password can not contain space!",
        });
      } else {
        if (password == confirm_password) {
          var filter = {
            email_address: email_address,
          };

          var salt = bcrypt.genSaltSync(10);
          var encryptPassword = bcrypt.hashSync(password, salt);
          console.log("Encrypted: ", encryptPassword);

          var update = {
            password: encryptPassword,
          };
          var searchedUser = await Rider.findOneAndUpdate(filter, update, {
            new: true,
          })
            .then((result) => {
              res.json({
                result: result,
                message: "Rider Updated Successfully!",
                status: "200",
                success: true,
              });
            })

            .catch((error) => {
              res.json({
                error,
                message: "Can not update password",
                status: "400",
                success: false,
              });
            });
        } else {
          res.send("Password and confirm password should be same!");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

module.exports = {
  checkDonorEmail,
  checkVendorEmail,
  checkAdminEmail,
  checkRiderEmail,
  sendForgotPasswordOtpEmail,
  verifyForgotPasswordOtp,
  updateDonorPassword,
  updateVendorPassword,
  updateAdminPassword,
  updateRiderPassword,
};
