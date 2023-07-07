const Victim = require("../models/Victim");

const bcrypt = require("bcryptjs");
const { uploadImageToCloudinary } = require("../utils/Cloudinary");

const { generateRandomPassword } = require("../utils/Basic");

const login = async (req, res) => {
  var { email_address, password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        console.log(err);
      } else {
        var singleUser = await Victim.find({
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
    var { email_address, full_name, phone_no, cnic, gender, address } =
      req.body;

    var password = generateRandomPassword().toString();

    console.log("password: ", password.toString());

    // Check if the user already exists
    const existingUser = await Victim.findOne({ email_address });
    if (existingUser) {
      res.status(409).json({
        status: "409",
        message: "User with the provided email address already exists.",
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          // Store hash in your password DB.
          if (err) {
            console.log(err);
          } else {
            const user = new Victim({
              email_address: email_address,
              full_name: full_name,
              password: hash,
              phone_no: phone_no,
              cnic: cnic,
              gender: gender,
              address: address,
            });
            let savedUser = await user
              .save()
              .then((resp) => {
                console.log(resp);
                res.status(201).json({
                  status: "201",
                  message: "New Victim registered!",
                  savedVictim: resp,
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
    }
  } catch (error) {
    var responseData = {
      status: "500",
      message: "Internal Server Error",
      error,
    };
    console.log(error);
    res.json(responseData);
  }
};

const getVictimById = async (req, res) => {
  try {
    var victim_id = req.params.victim_id;

    if (!victim_id || victim_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var victim = await Victim.findById(victim_id, {
        password: 0,
      })
        .then(async (onVictimFound) => {
          console.log("on victim found: ", onVictimFound);
          res.json({
            message: "Victim Found!",
            status: "200",
            victim_data: onVictimFound,
          });
        })
        .catch(async (onVictimFoundError) => {
          console.log("on victim found error: ", onVictimFoundError);
          res.json({
            message: "Victim Not Found With Provided ID!",
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

const deleteVictimById = async (req, res) => {
  try {
    var victim_id = req.params.victim_id;

    if (!victim_id || victim_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var victim = await Victim.findById(victim_id, {
        password: 0,
      })
        .then(async (onVictimFound) => {
          console.log("on victim found: ", onVictimFound);

          if (onVictimFound === null) {
            res.json({
              message: "Victim Not Found With Provided ID!",
              status: "404",
            });
          } else {
            var deletedVictim = await Victim.findByIdAndDelete(victim_id)
              .then(async (onVictimDelete) => {
                console.log("on victim delete: ", onVictimDelete);
                res.json({
                  message: "Victim deleted!",
                  status: "200",
                  deletedVictim: onVictimDelete,
                  success: true,
                });
              })
              .catch(async (onVictimDeleteError) => {
                console.log("on victim delete error: ", onVictimDeleteError);
                res.json({
                  message: "Something went wrong while deleting victim!",
                  status: "400",
                  success: false,
                });
              });
          }
        })
        .catch(async (onVictimFoundError) => {
          console.log("on victim found error: ", onVictimFoundError);
          res.json({
            message: "Victim Not Found With Provided ID!",
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

const updateVictimById = async (req, res) => {
  try {
    var victim_id = req.params.victim_id;

    var { email_address, full_name, phone_no, cnic, gender } = req.body;

    if (!victim_id || victim_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var victim = await Victim.findById(victim_id, {
        password: 0,
      })
        .then(async (onVictimFound) => {
          var filter = {
            _id: victim_id,
          };
          var updatedData = {
            email_address: email_address,
            full_name: full_name,
            phone_no: phone_no,
            cnic: cnic,
            gender: gender,
          };

          var updatedVictim = await Victim.findByIdAndUpdate(
            filter,
            updatedData,
            {
              new: true,
            }
          )
            .then(async (onVictimUpdate) => {
              console.log("on victim update: ", onVictimUpdate);
              res.json({
                message: "Victim Updated!",
                status: "200",
                updatedVictim: onVictimUpdate,
              });
            })
            .catch(async (onVictimUpdateError) => {
              console.log("on victim update error: ", onVictimUpdateError);
              res.json({
                message: "Something went wrong while updating victim!",
                status: "400",
              });
            });
        })
        .catch(async (onVictimFoundError) => {
          console.log("on victim found error: ", onVictimFoundError);
          res.json({
            message: "Victim not found!",
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
    var victim_id = req.params.victim_id;

    var { imageBase64 } = req.body;

    if (!victim_id || victim_id === "") {
      res.json({
        message: "Required fields are empty",
        status: "400",
      });
    } else {
      var victim = await Victim.findById(victim_id)
        .then(async (onVictimFound) => {
          console.log("on victim found: ", onVictimFound);

          uploadImageToCloudinary(imageBase64)
            .then(async (onImageUpload) => {
              console.log("on image upload: ", onImageUpload);

              var filter = {
                _id: onVictimFound._id,
              };

              var updatedData = {
                profile_picture: {
                  url: onImageUpload.secure_url,
                  public_id: onImageUpload.public_id,
                },
              };

              var updatedVictim = await Victim.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then(async (onVictimUpdate) => {
                  console.log("on victim update: ", onVictimUpdate);
                  res.json({
                    message: "Victim profile picture uploaded!",
                    status: "200",
                    updatedVictim: onVictimUpdate,
                    profile_image: onVictimUpdate.profile_picture.url,
                  });
                })
                .catch(async (onVictimUpdateError) => {
                  console.log("on victim update error: ", onVictimUpdateError);
                  res.json({
                    message:
                      "Something went wrong while updating profile picture!",
                    status: "400",
                    error: onVictimUpdateError,
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
        .catch(async (onVictimFoundError) => {
          console.log("on victim found error: ", onVictimFoundError);
          res.json({
            message: "Victim not found!",
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

const getAllVictims = async (req, res) => {
  try {
    var allVictims = await Victim.find()
      .then((onVictimsFound) => {
        console.log(" on victims found: ", onVictimsFound);

        res.json({
          message: "Victims found!",
          status: "200",
          allVictim: onVictimsFound,
        });
      })
      .catch((onVictimsFoundError) => {
        console.log(" on victim found error: ", onVictimsFoundError);
        res.json({
          message: "Victims not found!",
          status: "400",
          error: onVictimsFoundError,
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
  getVictimById,
  deleteVictimById,
  updateVictimById,
  uploadProfilePicture,
  getAllVictims,
};
