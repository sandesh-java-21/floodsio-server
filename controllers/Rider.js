const Rider = require("../models/Rider");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  var { email_address, password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        console.log(err);
      } else {
        var singleUser = await Rider.find({
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
          const user = new Rider({
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
                message: "New Rider registered!",
                savedRider: resp,
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

const getRiderById = async (req, res) => {
  try {
    var rider_id = req.params.rider_id;

    if (!rider_id || rider_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donor = await Rider.findById(rider_id, {
        password: 0,
      })
        .then(async (onRiderFound) => {
          console.log("on rider found: ", onRiderFound);
          res.json({
            message: "Rider Found!",
            status: "200",
            rider_data: onRiderFound,
          });
        })
        .catch(async (onRiderFoundError) => {
          console.log("on rider found error: ", onRiderFoundError);
          res.json({
            message: "Rider Not Found With Provided ID!",
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

const deleteRiderById = async (req, res) => {
  try {
    var rider_id = req.params.rider_id;

    if (!rider_id || rider_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donor = await Rider.findById(rider_id, {
        password: 0,
      })
        .then(async (onRiderFound) => {
          console.log("on rider found: ", onRiderFound);

          if (onRiderFound === null) {
            res.json({
              message: "Rider Not Found With Provided ID!",
              status: "404",
            });
          } else {
            var deletedRider = await Rider.findByIdAndDelete(rider_id)
              .then(async (onRiderDelete) => {
                console.log("on rider delete: ", onRiderDelete);
                res.json({
                  message: "Rider deleted!",
                  status: "200",
                  deletedRider: onRiderDelete,
                  success: true,
                });
              })
              .catch(async (onRiderDeleteError) => {
                console.log("on rider delete error: ", onRiderDeleteError);
                res.json({
                  message: "Something went wrong while deleting rider!",
                  status: "400",
                  success: false,
                });
              });
          }
        })
        .catch(async (onRiderFoundError) => {
          console.log("on rider found error: ", onRiderFoundError);
          res.json({
            message: "Rider Not Found With Provided ID!",
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

const updateRiderById = async (req, res) => {
  try {
    var rider_id = req.params.rider_id;

    var { email_address, full_name, phone_no, cnic, gender } = req.body;

    if (!rider_id || rider_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var rider = await Rider.findById(rider_id, {
        password: 0,
      })
        .then(async (onRiderFound) => {
          var filter = {
            _id: rider_id,
          };
          var updatedData = {
            email_address: email_address,
            full_name: full_name,
            phone_no: phone_no,
            cnic: cnic,
            gender: gender,
          };

          var updatedRider = await Rider.findByIdAndUpdate(
            filter,
            updatedData,
            {
              new: true,
            }
          )
            .then(async (onRiderUpdate) => {
              console.log("on rider update: ", onRiderUpdate);
              res.json({
                message: "Rider Updated!",
                status: "200",
                updatedRider: onRiderUpdate,
              });
            })
            .catch(async (onRiderUpdateError) => {
              console.log("on rider update error: ", onRiderUpdateError);
              res.json({
                message: "Something went wrong while updating rider!",
                status: "400",
              });
            });
        })
        .catch(async (onRiderFoundError) => {
          console.log("on rider found error: ", onRiderFoundError);
          res.json({
            message: "Rider not found!",
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
  getRiderById,
  updateRiderById,
  deleteRiderById,
};
