const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");
const { paymentTypes } = require("../utils/StatusTypes");

const makeOrderPayment = async (req, res) => {
  try {
    var account_id = req.params.account_id;

    var { order_amount, order_id } = req.body;

    if (!account_id || account_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var account = await Account.findById(account_id)
        .then(async (onAccountFound) => {
          console.log("on account found: ", onAccountFound);

          if (!order_amount || order_amount < 0) {
            res.json({
              message: "Order amount can not be a negative value!",
              status: "400",
            });
          } else {
            var transaction = new Transaction({
              account: onAccountFound._id,
              amount: order_amount,
            });

            var savedTransaction = await transaction
              .save()
              .then(async (onTransactionSave) => {
                console.log("on transaction save: ", onTransactionSave);

                var filter = {
                  _id: onAccountFound._id,
                };
                var updatedData = {
                  current_balance:
                    onAccountFound.current_balance + order_amount,
                };

                var updatedAccount = await Account.findByIdAndUpdate(
                  filter,
                  updatedData,
                  {
                    new: true,
                  }
                )
                  .then(async (onAccountUpdate) => {
                    console.log("on account update: ", onAccountUpdate);

                    var updatedAccount2 = await Account.findByIdAndUpdate(
                      filter,
                      {
                        $push: {
                          transactions: onTransactionSave._id,
                        },
                      },
                      {
                        new: true,
                      }
                    )
                      .then(async (onAccountUpdate2) => {
                        console.log("on account update 2: ", onAccountUpdate2);

                        var updatedOrder = await Order.findByIdAndUpdate(
                          {
                            _id: order_id,
                          },
                          {
                            payment_status: paymentTypes.paid,
                          },
                          { new: true }
                        )
                          .then((onOrderUpdate) => {
                            console.log("on order update: ", onOrderUpdate);
                            res.json({
                              message: "Order Payment Successful!",
                              status: "200",
                            });
                          })
                          .catch((onOrderUpdateError) => {
                            console.log(
                              "on order update error: ",
                              onOrderUpdateError
                            );
                            res.json({
                              message:
                                "Something went wrong while making payment for your order!",
                              status: "400",
                              error: onOrderUpdateError,
                            });
                          });
                      })
                      .catch((onAccountUpdateError2) => {
                        console.log(
                          "on account update error 2: ",
                          onAccountUpdateError2
                        );
                        res.json({
                          message:
                            "Something went wrong while making payment for your order!",
                          status: "400",
                          error: onAccountUpdateError2,
                        });
                      });
                  })
                  .catch((onAccountUpdateError) => {
                    console.log(
                      "on account update error: ",
                      onAccountUpdateError
                    );
                    res.json({
                      message:
                        "Something went wrong while making payment for your order!",
                      status: "400",
                      error: onAccountUpdateError,
                    });
                  });
              })
              .catch((onTransactionSaveError) => {
                console.log(
                  "on transaction save error: ",
                  onTransactionSaveError
                );
                res.json({
                  message:
                    "Something went wrong while creating the order payment transaction!",
                  status: "400",
                  error: onTransactionSaveError,
                });
              });
          }
        })
        .catch((onAccountFoundError) => {
          console.log("on account found error: ", onAccountFoundError);
          res.json({
            message: "Account not found!",
            status: "404",
            error: onAccountFoundError,
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

module.exports = {
  makeOrderPayment,
};
