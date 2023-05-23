const express = require("express");
const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");

const cors = require("cors");

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({ extended: false, limit: "50mb", parameterLimit: 50000 })
);

app.use(morgan("tiny"));

const indexRoutes = require("./routes/Index");

app.use("/api", indexRoutes);

app.listen(4000, (err) => {
  if (err) {
    console.log("Error: ", err);
  } else {
    console.log("FloodSio Server Is Running !");
    mongoose
      .connect(
        "mongodb+srv://newsy:BN7pG5VjOlCnV3d@newsy-cluster-1.imutdib.mongodb.net/floodsioDB"
      )
      .then(async (onConnect) => {
        console.log("FloodSio Database Connection Established!");
      })
      .catch(async (onConnectError) => {
        console.log("Something Went Wrong While Connecting To Database!");
      });
  }
});
