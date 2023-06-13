const orderTypes = {
  placed: "PLACED",
  finished: "FINISHED",
  preparing: "PREPARING",
  cancelled: "CANCELLED",
};

const paymentTypes = {
  not_paid: "NOT-PAID",
  paid: "PAID",
  partial: "PARTIAL",
};

module.exports = {
  orderTypes,
  paymentTypes,
};
