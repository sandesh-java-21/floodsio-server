const Order = require("../models/Order");
const Donor = require("../models/Donor");
const Vendor = require("../models/Vendor");
const Donation = require("../models/Donation");

const { checkOrderType, checkPaymentType } = require("../utils/Basic");
const { orderTypes } = require("../utils/StatusTypes");

const createOrder = async (req, res) => {
  try {
    var { donorId, total_amount, sub_total } = req.body;

    const donor = await Donor.findById(donorId)
      .populate("cart.item")
      .then(async (onDonorFound) => {
        console.log("on donor found: ", onDonorFound);

        const cartItems = onDonorFound.cart;

        var orderDonor = onDonorFound;

        var orderVendor = cartItems[0].vendor;

        const orderItems = cartItems.map((cartItem) => {
          return {
            item: cartItem.item,
            quantity: cartItem.quantity,
          };
        });

        var order = new Order({
          donor: orderDonor,
          vendor: orderVendor,
          items: orderItems,
          total_amount: total_amount,
          sub_total: sub_total,
        });

        var savedOrder = await order
          .save()
          .then(async (onOrderSave) => {
            console.log("on order save: ", onOrderSave);

            onDonorFound.cart = [];
            await onDonorFound.save();

            res.json({
              message: "Order Created!",
              status: "200",
              order: onOrderSave,
            });
          })
          .catch((onOrderSaveError) => {
            console.log("on order save error: ", onOrderSaveError);
            res.json({
              message: "Something went wrong while creating order!",
              status: "400",
              error: onOrderSaveError,
            });
          });
      })
      .catch((onDonorFoundError) => {
        console.log("on donor found error: ", onDonorFoundError);
        res.json({
          message: "Donor not found!",
          status: "404",
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

const updateOrderStatus = async (req, res) => {
  try {
    var order_id = req.params.order_id;
    var { updatedStatus } = req.body;

    if (!order_id || order_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var order_status = checkOrderType(updatedStatus);

      console.log("order status from function: ", order_status);

      var filter = {
        _id: order_id,
      };

      var updatedData = {
        order_status: order_status,
      };

      var order = await Order.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onOrderStatusUpdate) => {
          console.log("on order status update: ", onOrderStatusUpdate);

          res.json({
            message: `Order status changed to ${order_status}`,
            status: "200",
            updatedOrder: onOrderStatusUpdate,
            updatedStatus: onOrderStatusUpdate.order_status,
          });
        })
        .catch((onOrderStatusUpdateError) => {
          console.log(
            "on order status update error: ",
            onOrderStatusUpdateError
          );
          res.json({
            message:
              "Order not found or something went wrong while updating order status!",
            status: "400",
            error: onOrderStatusUpdateError,
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

const updateOrderPaymentStatus = async (req, res) => {
  try {
    var order_id = req.params.order_id;
    var { updatedStatus } = req.body;

    if (!order_id || order_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var payment_status = checkPaymentType(updatedStatus);

      console.log("order payment status from function: ", payment_status);

      var filter = {
        _id: order_id,
      };

      var updatedData = {
        payment_status: payment_status,
      };

      var order = await Order.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onOrderStatusUpdate) => {
          console.log("on order payment status update: ", onOrderStatusUpdate);

          res.json({
            message: `Order payment status changed to ${payment_status}`,
            status: "200",
            updatedOrder: onOrderStatusUpdate,
            updatedPaymentStatus: onOrderStatusUpdate.payment_status,
          });
        })
        .catch((onOrderStatusUpdateError) => {
          console.log(
            "on order payment status update error: ",
            onOrderStatusUpdateError
          );
          res.json({
            message:
              "Order not found or something went wrong while updating order payment status!",
            status: "400",
            error: onOrderStatusUpdateError,
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

const getOrder = async (req, res) => {
  try {
    var order_id = req.params.order_id;

    if (!order_id || order_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var order = await Order.findById(order_id)
        .populate(["donor", "vendor", "items.item"])
        .then((onOrderFound) => {
          console.log("on order found: ", onOrderFound);

          res.json({
            message: "Order found!",
            status: "200",
            order: onOrderFound,
          });
        })
        .catch((onOrderFoundError) => {
          console.log("on order found error: ", onOrderFoundError);
          res.json({
            message: "Order not found!",
            status: "404",
            error: onOrderFoundError,
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

const getAllVendorOrders = async (req, res) => {
  try {
    var vendor_id = req.params.vendor_id;

    if (!vendor_id || vendor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var orders = await Order.find({
        vendor: vendor_id,
      })
        .populate(["donor", "vendor", "items.item"])
        .then((onOrdersFound) => {
          console.log("on vendor orders found: ", onOrdersFound);

          res.json({
            message: "Vendor Orders found!",
            status: "200",
            vendor_orders: onOrdersFound,
          });
        })
        .catch((onOrderFoundError) => {
          console.log("on vendor order found error: ", onOrderFoundError);
          res.json({
            message: "Vendor Orders not found!",
            status: "404",
            error: onOrderFoundError,
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

const getAllDonorOrders = async (req, res) => {
  try {
    var donor_id = req.params.donor_id;

    if (!donor_id || donor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var orders = await Order.find({
        donor: donor_id,
      })
        .populate(["donor", "vendor", "items.item"])
        .then((onOrdersFound) => {
          console.log("on donor orders found: ", onOrdersFound);

          res.json({
            message: "Donor Orders found!",
            status: "200",
            donor_orders: onOrdersFound,
          });
        })
        .catch((onOrderFoundError) => {
          console.log("on donor order found error: ", onOrderFoundError);
          res.json({
            message: "Dono Orders not found!",
            status: "404",
            error: onOrderFoundError,
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

const finishOrder = async (req, res) => {
  try {
    var order_id = req.params.order_id;

    if (!order_id || order_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var order = await Order.findById(order_id)
        .then(async (onOrderFound) => {
          console.log("on order found: ", onOrderFound);

          var donation = new Donation({
            donor: onOrderFound.donor,
            vendor: onOrderFound.vendor,
            rider: null,
            evidencePicture: "",
            items: onOrderFound.items,
            victim: null,
          });

          var savedDonation = await donation
            .save()
            .then(async (onDonationSave) => {
              console.log("on donation save: ", onDonationSave);

              var filter = {
                _id: onOrderFound._id,
              };

              var updatedData = {
                completed: true,
                order_status: orderTypes.finished,
              };

              var updatedOrder = await Order.findByIdAndUpdate(
                filter,
                updatedData,
                {
                  new: true,
                }
              )
                .then((onOrderComplete) => {
                  console.log("on order complete: ", onOrderComplete);

                  res.json({
                    message: "Order finished!",
                    status: "200",
                    updatedOrder: onOrderComplete,
                  });
                })
                .catch((onOrderCompleteError) => {
                  console.log(
                    "on order complete error: ",
                    onOrderCompleteError
                  );
                  res.json({
                    message: "Something went wrong while finishing the order!",
                    status: "400",
                    error: onOrderCompleteError,
                  });
                });
            })
            .catch((onDonationSaveError) => {
              console.log("on donation save error: ", onDonationSaveError);
              res.json({
                message: "Something went wrong while saving the donation!",
                status: "400",
                error: onDonationSaveError,
              });
            });
        })
        .catch((onOrderFoundError) => {
          console.log("on order found error: ", onOrderFoundError);
          res.json({
            message: "Order not found!",
            status: "404",
            error: onOrderFoundError,
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
  createOrder,
  updateOrderStatus,
  updateOrderPaymentStatus,
  getOrder,
  getAllVendorOrders,
  getAllDonorOrders,
  finishOrder,
};
