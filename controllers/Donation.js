const Donation = require("../models/Donation");
const Rider = require("../models/Rider");
const Victim = require("../models/Victim");

const { uploadImageToCloudinary } = require("../utils/Cloudinary");

const assignDonationToRider = async (req, res) => {
  try {
    var donation_id = req.params.donation_id;

    var { victim_id, rider_id } = req.body;

    if (
      !donation_id ||
      donation_id === "" ||
      !victim_id ||
      victim_id === "" ||
      !rider_id ||
      rider_id === ""
    ) {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donation = await Donation.findById(donation_id)
        .then(async (onDonationFound) => {
          console.log("on donation found: ", onDonationFound);

          var rider = await Rider.findById(rider_id)
            .then(async (onRiderFound) => {
              console.log("on rider found: ", onRiderFound);

              if (
                !onDonationFound.completed &&
                onRiderFound.current_assgined_donation !== null
              ) {
                res.json({
                  message:
                    "Rider has a donation assigned already and is not completed!",
                });
              } else {
                var victim = await Victim.findById(victim_id)
                  .then(async (onVictimFound) => {
                    console.log("on victim found: ", onVictimFound);

                    var filter = {
                      _id: onDonationFound._id,
                    };

                    var updatedData = {
                      rider: onRiderFound._id,
                      victim: onVictimFound._id,
                    };

                    var updatedDonation = await Donation.findByIdAndUpdate(
                      filter,
                      updatedData,
                      {
                        new: true,
                      }
                    )
                      .then(async (onDonationAssigned) => {
                        console.log(
                          "on donation assigned: ",
                          onDonationAssigned
                        );

                        var filter = {
                          _id: onRiderFound._id,
                        };

                        var updatedData = {
                          current_assgined_donation: onDonationFound._id,
                        };

                        var updatedRider = await Rider.findByIdAndUpdate(
                          filter,
                          updatedData,
                          {
                            new: true,
                          }
                        )
                          .then((onRiderAssigned) => {
                            console.log("on rider assigned: ", onRiderAssigned);

                            res.json({
                              message: "Donation assigned successfully!",
                              status: "200",
                              victim: onVictimFound,
                              rider: onRiderFound,
                            });
                          })
                          .catch((onRiderAssignedError) => {
                            console.log(
                              "on rider assigned error: ",
                              onRiderAssignedError
                            );
                            res.json({
                              message:
                                "Something went wrong while assiging donation!",
                              status: "400",
                              error: onRiderAssignedError,
                            });
                          });
                      })
                      .catch((onDonationAssignedError) => {
                        console.log(
                          "on donation assigned error: ",
                          onDonationAssignedError
                        );
                        res.json({
                          message:
                            "Something went wrong while assiging donation!",
                          status: "400",
                          error: onDonationAssignedError,
                        });
                      });
                  })
                  .catch((onVictimFoundError) => {
                    console.log("on victim found error: ", onVictimFoundError);
                    res.json({
                      message: "Victim not found!",
                      status: "404",
                      error: onVictimFoundError,
                    });
                  });
              }
            })
            .catch((onRiderFoundError) => {
              console.log("on rider found error: ", onRiderFoundError);
            });
        })
        .catch((onDonationFoundError) => {
          console.log("on donation found error: ", onDonationFoundError);
          res.json({
            message: "Donation not found!",
            status: "404",
            error: onDonationFoundError,
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

const completeDonation = async (req, res) => {
  try {
    var donation_id = req.params.donation_id;

    if (!donation_id || donation_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donation = await Donation.findById(donation_id)
        .then(async (onDonationFound) => {
          console.log("on donation found: ", onDonationFound);

          if (onDonationFound.completed) {
            res.json({
              message: "Donation is already completed!",
              status: "400",
            });
          } else {
            var filter = {
              _id: onDonationFound._id,
            };

            var updatedData = {
              completed: true,
            };

            var updatedDonation = await Donation.findByIdAndUpdate(
              filter,
              updatedData,
              {
                new: true,
              }
            )
              .then(async (onDonationComplete) => {
                console.log("on donation complete: ", onDonationComplete);

                var updatedRider = await Rider.findByIdAndUpdate(
                  {
                    _id: onDonationFound.rider,
                  },
                  {
                    $push: {
                      completedDonations: onDonationFound._id,
                    },
                    current_assgined_donation: null,
                  },
                  {
                    new: true,
                  }
                )
                  .then((onRiderUpdate) => {
                    console.log("on rider update: ", onRiderUpdate);

                    res.json({
                      message: "Donation completed successfully!",
                      status: "200",
                    });
                  })
                  .catch((onRiderUpdateError) => {
                    console.log("on rider update error: ", onRiderUpdateError);
                    res.json({
                      message:
                        "Something went wrong while completing donation!",
                      status: "400",
                      error: onRiderUpdateError,
                    });
                  });
              })
              .catch((onDonationCompleteError) => {
                console.log(
                  "on donation complete error: ",
                  onDonationCompleteError
                );
                res.json({
                  message: "Something went wrong while completing donation!",
                  status: "400",
                  error: onDonationCompleteError,
                });
              });
          }
        })
        .catch((onDonationFoundError) => {
          console.log("on donation found error: ", onDonationFoundError);
          res.json({
            message: "Donation not found!",
            status: "404",
            error: onDonationFoundError,
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

const uploadDonationEvidence = async (req, res) => {
  try {
    var donation_id = req.params.donation_id;
    var { imageBase64 } = req.body;

    if (
      !donation_id ||
      donation_id === "" ||
      !imageBase64 ||
      imageBase64 === ""
    ) {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donation = await Donation.findById(donation_id)
        .then(async (onDonationFound) => {
          console.log("on donation found: ", onDonationFound);

          if (!onDonationFound.completed) {
            res.json({
              message: "Donation is not completed yet!",
              status: "400",
            });
          } else {
            uploadImageToCloudinary(imageBase64, "donation-evidences")
              .then(async (onImageUpload) => {
                console.log("on image upload: ", onImageUpload);

                var filter = {
                  _id: onDonationFound._id,
                };

                var updatedData = {
                  evidencePicture: onImageUpload.secure_url,
                };

                var updatedDonation = await Donation.findByIdAndUpdate(
                  filter,
                  updatedData,
                  {
                    new: true,
                  }
                )
                  .then((onEvidenceUpload) => {
                    console.log("on evidence upload: ", onEvidenceUpload);

                    res.json({
                      message: "Donation completion evidence uploaded!",
                      status: "200",
                      evidence: onEvidenceUpload.evidencePicture,
                    });
                  })
                  .catch((onEvidenceUploadError) => {
                    console.log(
                      "on evidence upload error: ",
                      onEvidenceUploadError
                    );
                    res.json({
                      message:
                        "Something went wrong while uploading donation evidence!",
                      status: "400",
                      error: onEvidenceUploadError,
                    });
                  });
              })
              .catch((onImageUploadError) => {
                console.log("on image upload error: ", onImageUploadError);
                res.json({
                  message:
                    "Something went wrong while uploading donation evidence!",
                  status: "400",
                  error: onImageUploadError,
                });
              });
          }
        })
        .catch((onDonationFoundError) => {
          console.log("on donation found error: ", onDonationFoundError);
          res.json({
            message: "Donation not found!",
            status: "404",
            error: onDonationFoundError,
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

const getDonation = async (req, res) => {
  try {
    var donation_id = req.params.donation_id;

    if (!donation_id || donation_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donation = await Donation.findById(donation_id)
        .populate("donor")
        .populate("vendor")
        .populate("rider")
        .populate("victim")
        .populate("items.item")
        .then(async (onDonationFound) => {
          console.log("on donation found: ", onDonationFound);

          res.json({
            message: "Donation found!",
            status: "200",
            donation: onDonationFound,
          });
        })
        .catch((onDonationFoundError) => {
          console.log("on donation found error: ", onDonationFoundError);
          res.json({
            message: "Donation not found!",
            status: "404",
            error: onDonationFoundError,
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

const getDonorsDonations = async (req, res) => {
  try {
    var donor_id = req.params.donor_id;

    if (!donor_id || donor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var donation = await Donation.find({
        donor: donor_id,
      })
        .populate("donor")
        .populate("vendor")
        .populate("rider")
        .populate("victim")
        .populate("items.item")
        .then(async (onDonationFound) => {
          console.log("on donation found: ", onDonationFound);

          if (onDonationFound.length <= 0) {
            res.json({
              message: "No donations found for this donor!",
              status: "404",
            });
          } else {
            res.json({
              message: "Donation found!",
              status: "200",
              donation: onDonationFound,
            });
          }
        })
        .catch((onDonationFoundError) => {
          console.log("on donation found error: ", onDonationFoundError);
          res.json({
            message: "Donation not found!",
            status: "404",
            error: onDonationFoundError,
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

const getAllDonations = async (req, res) => {
  try {
    var donation = await Donation.find({})
      .populate("donor")
      .populate("vendor")
      .populate("rider")
      .populate("victim")
      .populate("items.item")
      .then(async (onDonationFound) => {
        console.log("on donation found: ", onDonationFound);

        if (onDonationFound.length <= 0) {
          res.json({
            message: "No donations found for this donor!",
            status: "404",
          });
        } else {
          res.json({
            message: "Donation found!",
            status: "200",
            donation: onDonationFound,
            total: onDonationFound.length,
          });
        }
      })
      .catch((onDonationFoundError) => {
        console.log("on donation found error: ", onDonationFoundError);
        res.json({
          message: "Donation not found!",
          status: "404",
          error: onDonationFoundError,
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
  assignDonationToRider,
  completeDonation,
  uploadDonationEvidence,
  getDonation,
  getDonorsDonations,
  getAllDonations,
};
