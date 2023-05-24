const Donor = require("../models/Donor");
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
        var singleUser = await Donor.find({
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
          const user = new Donor({
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
                message: "New Donor registered!",
                savedDonor: resp,
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

const getDonorById = async (req, res) => {
  try {
    var donor_id = req.params.donor_id;

    if (!donor_id || donor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donor = await Donor.findById(donor_id, {
        password: 0,
      })
        .then(async (onDonorFound) => {
          console.log("on donor found: ", onDonorFound);
          res.json({
            message: "Donor Found!",
            status: "200",
            donor_data: onDonorFound,
          });
        })
        .catch(async (onDonorFoundError) => {
          console.log("on donor found error: ", onDonorFoundError);
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

const deleteDonorById = async (req, res) => {
  try {
    var donor_id = req.params.donor_id;

    if (!donor_id || donor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donor = await Donor.findById(donor_id, {
        password: 0,
      })
        .then(async (onDonorFound) => {
          console.log("on donor found: ", onDonorFound);

          if (onDonorFound === null) {
            res.json({
              message: "Donor Not Found With Provided ID!",
              status: "404",
            });
          } else {
            var deletedDonor = await Donor.findByIdAndDelete(donor_id)
              .then(async (onDonorDelete) => {
                console.log("on donor delete: ", onDonorDelete);
                res.json({
                  message: "Donor deleted!",
                  status: "200",
                  deletedDonor: onDonorDelete,
                  success: true,
                });
              })
              .catch(async (onDonorDeleteError) => {
                console.log("on donor delete error: ", onDonorDeleteError);
                res.json({
                  message: "Something went wrong while deleting donor!",
                  status: "400",
                  success: false,
                });
              });
          }
        })
        .catch(async (onDonorFoundError) => {
          console.log("on donor found error: ", onDonorFoundError);
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

const updateDonorById = async (req, res) => {
  try {
    var donor_id = req.params.donor_id;

    var { email_address, full_name, phone_no, cnic, gender } = req.body;

    if (!donor_id || donor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donor = await Donor.findById(donor_id, {
        password: 0,
      })
        .then(async (onDonorFound) => {
          var filter = {
            _id: donor_id,
          };
          var updatedData = {
            email_address: email_address,
            full_name: full_name,
            phone_no: phone_no,
            cnic: cnic,
            gender: gender,
          };

          var updatedDonor = await Donor.findByIdAndUpdate(
            filter,
            updatedData,
            {
              new: true,
            }
          )
            .then(async (onDonorUpdate) => {
              console.log("on donor update: ", onDonorUpdate);
              res.json({
                message: "Donor Updated!",
                status: "200",
                updatedDonor: onDonorUpdate,
              });
            })
            .catch(async (onDonorUpdateError) => {
              console.log("on donor update error: ", onDonorUpdateError);
              res.json({
                message: "Something went wrong while updating donor!",
                status: "400",
              });
            });
        })
        .catch(async (onDonorFoundError) => {
          console.log("on donor found error: ", onDonorFoundError);
          res.json({
            message: "Donor not found!",
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
    var donor_id = req.params.donor_id;

    var { imageBase64 } = req.body;

    if (!donor_id || donor_id === "") {
      res.json({
        message: "Required fields are empty",
        status: "400",
      });
    } else {
      var donor = await Donor.findById(donor_id)
        .then(async (onDonorFound) => {
          console.log("on donor found: ", onDonorFound);

          uploadImageToCloudinary(imageBase64)
            .then(async (onImageUpload) => {
              console.log("on image upload: ", onImageUpload);

              var filter = {
                _id: onDonorFound._id,
              };

              var updatedData = {
                profile_picture: {
                  url: onImageUpload.secure_url,
                  public_id: onImageUpload.public_id,
                },
              };

              var updatedDonor = await Donor.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then(async (onDonorUpdate) => {
                  console.log("on donor update: ", onDonorUpdate);
                  res.json({
                    message: "Donor profile picture uploaded!",
                    status: "200",
                    updatedDonor: onDonorUpdate,
                    profile_image: onDonorUpdate.profile_picture.url,
                  });
                })
                .catch(async (onDonorUpdateError) => {
                  console.log("on donor update error: ", onDonorUpdateError);
                  res.json({
                    message:
                      "Something went wrong while updating profile picture!",
                    status: "400",
                    error: onDonorUpdateError,
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
        .catch(async (onDonorFoundError) => {
          console.log("on donor found error: ", onDonorFoundError);
          res.json({
            message: "Donor not found!",
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
  getDonorById,
  deleteDonorById,
  updateDonorById,
  uploadProfilePicture,
};
