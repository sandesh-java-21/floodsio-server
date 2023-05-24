const Admin = require("../models/Admin");
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
        var singleUser = await Admin.find({
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
          const user = new Admin({
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
                message: "New Admin registered!",
                savedAdmin: resp,
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

const getAdminById = async (req, res) => {
  try {
    var admin_id = req.params.admin_id;

    if (!admin_id || admin_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var admin = await Admin.findById(admin_id, {
        password: 0,
      })
        .then(async (onAdminFound) => {
          console.log("on admin found: ", onAdminFound);
          res.json({
            message: "Admin Found!",
            status: "200",
            admin_data: onAdminFound,
          });
        })
        .catch(async (onAdminFoundError) => {
          console.log("on admin found error: ", onAdminFoundError);
          res.json({
            message: "Admin Not Found With Provided ID!",
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

const deleteAdminById = async (req, res) => {
  try {
    var admin_id = req.params.admin_id;

    if (!admin_id || admin_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var admin = await Admin.findById(admin_id, {
        password: 0,
      })
        .then(async (onAdminFound) => {
          console.log("on admin found: ", onAdminFound);

          if (onAdminFound === null) {
            res.json({
              message: "Admin Not Found With Provided ID!",
              status: "404",
            });
          } else {
            var deletedAdmin = await Admin.findByIdAndDelete(admin_id)
              .then(async (onAdminDelete) => {
                console.log("on admin delete: ", onAdminDelete);
                res.json({
                  message: "Admin deleted!",
                  status: "200",
                  deletedAdmin: onAdminDelete,
                  success: true,
                });
              })
              .catch(async (onAdminDeleteError) => {
                console.log("on admin delete error: ", onAdminDeleteError);
                res.json({
                  message: "Something went wrong while deleting admin!",
                  status: "400",
                  success: false,
                });
              });
          }
        })
        .catch(async (onAdminFoundError) => {
          console.log("on admin found error: ", onAdminFoundError);
          res.json({
            message: "Admin Not Found With Provided ID!",
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

const updateAdminById = async (req, res) => {
  try {
    var admin_id = req.params.admin_id;

    var { email_address, full_name, phone_no, cnic, gender } = req.body;

    if (!admin_id || admin_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var admin = await Admin.findById(admin_id, {
        password: 0,
      })
        .then(async (onAdminFound) => {
          var filter = {
            _id: admin_id,
          };
          var updatedData = {
            email_address: email_address,
            full_name: full_name,
            phone_no: phone_no,
            cnic: cnic,
            gender: gender,
          };

          var updatedAdmin = await Admin.findByIdAndUpdate(
            filter,
            updatedData,
            {
              new: true,
            }
          )
            .then(async (onAdminUpdate) => {
              console.log("on admin update: ", onAdminUpdate);
              res.json({
                message: "Admin Updated!",
                status: "200",
                updatedAdmin: onAdminUpdate,
              });
            })
            .catch(async (onAdminUpdateError) => {
              console.log("on admin update error: ", onAdminUpdateError);
              res.json({
                message: "Something went wrong while updating admin!",
                status: "400",
              });
            });
        })
        .catch(async (onAdminFoundError) => {
          console.log("on admin found error: ", onAdminFoundError);
          res.json({
            message: "Admin not found!",
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
    var admin_id = req.params.admin_id;

    var { imageBase64 } = req.body;

    if (!admin_id || admin_id === "") {
      res.json({
        message: "Required fields are empty",
        status: "400",
      });
    } else {
      var admin = await Admin.findById(admin_id)
        .then(async (onAdminFound) => {
          console.log("on admin found: ", onAdminFound);

          uploadImageToCloudinary(imageBase64)
            .then(async (onImageUpload) => {
              console.log("on image upload: ", onImageUpload);

              var filter = {
                _id: onAdminFound._id,
              };

              var updatedData = {
                profile_picture: {
                  url: onImageUpload.secure_url,
                  public_id: onImageUpload.public_id,
                },
              };

              var updatedAdmin = await Admin.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then(async (onAdminUpdate) => {
                  console.log("on admin update: ", onAdminUpdate);
                  res.json({
                    message: "Admin profile picture uploaded!",
                    status: "200",
                    updatedAdmin: onAdminUpdate,
                    profile_image: onAdminUpdate.profile_picture.url,
                  });
                })
                .catch(async (onAdminUpdateError) => {
                  console.log("on admin update error: ", onAdminUpdateError);
                  res.json({
                    message:
                      "Something went wrong while updating profile picture!",
                    status: "400",
                    error: onAdminUpdateError,
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
        .catch(async (onAdminFoundError) => {
          console.log("on admin found error: ", onAdminFoundError);
          res.json({
            message: "Admin not found!",
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

module.exports = {
  login,
  signUp,
  getAdminById,
  deleteAdminById,
  updateAdminById,
  uploadProfilePicture,
};
