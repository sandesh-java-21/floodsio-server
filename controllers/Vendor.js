const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const { uploadImageToCloudinary } = require("../utils/Cloudinary");

const login = async (req, res) => {
  var { email_address, password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        console.log(err);
      } else {
        var singleUser = await Vendor.find({
          email_address: email_address,
        });

        try {
          if (singleUser && singleUser.length === 0) {
            var responseData = {
              message:
                "Invalid username or password! No user found for given email address and password.",
              status: "404",
            };

            res.status(404).json(responseData);
          } else {
            bcrypt.compare(
              password,
              singleUser[0].password,
              function (err, result) {
                if (result) {
                  var responseData = {
                    status: "200",
                    message: "Login Successful!",
                    email_address: singleUser[0].email_address,
                    singleUser: singleUser[0],
                  };
                  res.json(responseData);
                } else {
                  console.log("error: ", err);
                  var responseData = {
                    message:
                      "Invalid username or password! No user found for given email address or password.",
                    status: "404",
                  };
                  res.json(responseData);
                }
              }
            );
          }
        } catch (error) {
          console.log(error);
          res.json({
            message: "Internal server error",
            status: "500",
            error,
          });
        }
      }
    });
  });
};

const signUp = async (req, res) => {
  try {
    var { email_address, password, full_name, phone_no, cnic, gender } =
      req.body;

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        // Store hash in your password DB.
        if (err) {
          console.log(err);
        } else {
          const user = new Vendor({
            email_address: email_address,
            full_name: full_name,
            password: hash,
            phone_no: phone_no,
            cnic: cnic,
            gender: gender,
          });
          let savedUser = await user
            .save()
            .then((resp) => {
              console.log(resp);
              res.status(201).json({
                status: "201",
                message: "New Vendor registered!",
                savedVendor: resp,
              });
            })

            .catch((error) => {
              console.log(error);
              var responseData = {
                status: "422",
                errors: error,
              };
              res.status(422).json(responseData);
            });

          console.log(hash);
        }
      });
    });
  } catch (error) {
    var responseData = {
      status: "500",
      message: "Internal Server Error",
      error,
    };
    res.json(responseData);
    console.log(error);
  }
};

const getVendorById = async (req, res) => {
  try {
    var vendor_id = req.params.vendor_id;

    if (!vendor_id || vendor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var vendor = await Vendor.findById(vendor_id, {
        password: 0,
      })
        .then(async (onVendorFound) => {
          console.log("on vendor found: ", onVendorFound);
          res.json({
            message: "Vendor Found!",
            status: "200",
            vendor_data: onVendorFound,
          });
        })
        .catch(async (onVendorFoundError) => {
          console.log("on vendor found error: ", onVendorFoundError);
          res.json({
            message: "Vendor Not Found With Provided ID!",
            status: "404",
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const deleteVendorById = async (req, res) => {
  try {
    var vendor_id = req.params.vendor_id;

    if (!vendor_id || vendor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var vendor = await Vendor.findById(vendor_id, {
        password: 0,
      })
        .then(async (onVendorFound) => {
          console.log("on vendor found: ", onVendorFound);

          if (onVendorFound === null) {
            res.json({
              message: "Vendor Not Found With Provided ID!",
              status: "404",
            });
          } else {
            var deletedVendor = await Vendor.findByIdAndDelete(vendor_id)
              .then(async (onVendorDelete) => {
                console.log("on vendor delete: ", onVendorDelete);
                res.json({
                  message: "Vendor deleted!",
                  status: "200",
                  deletedVendor: onVendorDelete,
                  success: true,
                });
              })
              .catch(async (onVendorDeleteError) => {
                console.log("on vendor delete error: ", onVendorDeleteError);
                res.json({
                  message: "Something went wrong while deleting vendor!",
                  status: "400",
                  success: false,
                });
              });
          }
        })
        .catch(async (onVendorFoundError) => {
          console.log("on vendor found error: ", onVendorFoundError);
          res.json({
            message: "Donor Not Found With Provided ID!",
            status: "404",
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const updateVendorById = async (req, res) => {
  try {
    var vendor_id = req.params.vendor_id;

    var { email_address, full_name, phone_no, cnic, gender } = req.body;

    if (!vendor_id || vendor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var vendor = await Vendor.findById(vendor_id, {
        password: 0,
      })
        .then(async (onVendorFound) => {
          var filter = {
            _id: vendor_id,
          };
          var updatedData = {
            email_address: email_address,
            full_name: full_name,
            phone_no: phone_no,
            cnic: cnic,
            gender: gender,
          };

          var updatedVendor = await Vendor.findByIdAndUpdate(
            filter,
            updatedData,
            {
              new: true,
            }
          )
            .then(async (onVendorUpdate) => {
              console.log("on vendor update: ", onVendorUpdate);
              res.json({
                message: "Vendor Updated!",
                status: "200",
                updatedVendor: onVendorUpdate,
              });
            })
            .catch(async (onVendorUpdateError) => {
              console.log("on vendor update error: ", onVendorUpdateError);
              res.json({
                message: "Something went wrong while updating vendor!",
                status: "400",
              });
            });
        })
        .catch(async (onVendorFoundError) => {
          console.log("on vendor found error: ", onVendorFoundError);
          res.json({
            message: "Vendor not found!",
            status: "404",
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    var vendor_id = req.params.vendor_id;

    var { imageBase64 } = req.body;

    if (!vendor_id || vendor_id === "") {
      res.json({
        message: "Required fields are empty",
        status: "400",
      });
    } else {
      var vendor = await Vendor.findById(vendor_id)
        .then(async (onVendorFound) => {
          console.log("on vendor found: ", onVendorFound);

          uploadImageToCloudinary(imageBase64)
            .then(async (onImageUpload) => {
              console.log("on image upload: ", onImageUpload);

              var filter = {
                _id: onVendorFound._id,
              };

              var updatedData = {
                profile_picture: {
                  url: onImageUpload.secure_url,
                  public_id: onImageUpload.public_id,
                },
              };

              var updatedVendor = await Vendor.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then(async (onVendorUpdate) => {
                  console.log("on vendor update: ", onVendorUpdate);
                  res.json({
                    message: "Vendor profile picture uploaded!",
                    status: "200",
                    updatedVendor: onVendorUpdate,
                    profile_image: onVendorUpdate.profile_picture.url,
                  });
                })
                .catch(async (onVendorUpdateError) => {
                  console.log("on vendor update error: ", onVendorUpdateError);
                  res.json({
                    message:
                      "Something went wrong while updating profile picture!",
                    status: "400",
                    error: onVendorUpdateError,
                  });
                });
            })
            .catch(async (onImageUploadError) => {
              console.log("on image upload error: ", onImageUploadError);
              res.json({
                message: "Something went wrong while uploading image to cloud!",
                status: "400",
                error: onImageUploadError,
              });
            });
        })
        .catch(async (onVendorFoundError) => {
          console.log("on vendor found error: ", onVendorFoundError);
          res.json({
            message: "Vendor not found!",
            status: "404",
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const getAllVendors = async (req, res) => {
  try {
    var vendors = await Vendor.find(
      {},
      {
        password: 0,
      }
    )
      .populate("items")
      .then((onVendorsFound) => {
        console.log("on vendors found: ", onVendorsFound);
        res.json({
          message:
            onVendorsFound.length > 0 ? "Vendors found!" : "No vendors found!",
          status: "200",
          allVendors: onVendorsFound,
        });
      })
      .catch((onVendorsFoundError) => {
        console.log("on vendors found error: ", onVendorsFoundError);
        res.json({
          message: "Something went wrong while getting all vendors!",
          status: "400",
          error: onVendorsFoundError,
        });
      });
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = {
  login,
  signUp,
  getVendorById,
  deleteVendorById,
  updateVendorById,
  uploadProfilePicture,
  getAllVendors,
};
