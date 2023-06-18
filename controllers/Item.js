const Item = require("../models/Item");

const { uploadImageToCloudinary } = require("../utils/Cloudinary");

const createItem = async (req, res) => {
  try {
    var { name, description, price, quantity, imageBase64, vendor, category } =
      req.body;

    if (
      !name ||
      name === "" ||
      !description ||
      description === "" ||
      !price ||
      price < 0 ||
      !quantity ||
      quantity < 0 ||
      !imageBase64 ||
      imageBase64 === "" ||
      !vendor ||
      vendor === ""
    ) {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      uploadImageToCloudinary(imageBase64, "items")
        .then(async (onImageUpload) => {
          console.log("on image upload: ", onImageUpload);

          const item = new Item({
            name,
            description,
            price,
            quantity,
            image: {
              url: onImageUpload.secure_url,
              public_id: onImageUpload.public_id,
            },
            vendor,
            is_in_need: false,
            category,
          });

          var savedItem = item.save().then((onItemSave) => {
            console.log("on item save: ", onItemSave);
            res.json({
              message: "New Item Added!",
              status: "200",
              savedItem: onItemSave,
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
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    var items = await Item.find()
      .populate(["vendor", "category"])
      .then((onItemsFound) => {
        console.log("on items found: ", onItemsFound);
        res.json({
          message: "Items found!",
          status: "200",
          allItems: onItemsFound,
        });
      })
      .catch((onItemsFoundError) => {
        console.log("on items found error: ", onItemsFoundError);
        res.json({
          message: "Something went wrong while getting all items!",
          status: "400",
          error: onItemsFoundError,
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

const getItemById = async (req, res) => {
  try {
    var item_id = req.params.item_id;

    if (!item_id || item_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var item = await Item.findById(item_id)
        .populate(["vendor", "category"])
        .then((onItemFound) => {
          console.log("on item found: ", onItemFound);

          res.json({
            message: "Item found!",
            status: "200",
            item: onItemFound,
          });
        })
        .catch((onItemFoundError) => {
          console.log("on item found error: ", onItemFoundError);
          res.json({
            message: "Item not found with provided id!",
            status: "404",
            error: onItemFoundError,
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

const deleteItemById = async (req, res) => {
  try {
    var item_id = req.params.item_id;

    if (!item_id || item_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var deletedItem = await Item.findByIdAndDelete(item_id)
        .then((onItemDelete) => {
          console.log("on item delete: ", onItemDelete);
          res.json({
            message: "Item deleted!",
            status: "200",
            deletedItem: onItemDelete,
          });
        })
        .catch((onItemDeleteError) => {
          console.log("on item delete error: ", onItemDeleteError);
          res.json({
            message: "Item not found!",
            status: "404",
            error: onItemDeleteError,
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

const getItemsByVendorId = async (req, res) => {
  try {
    var vendor_id = req.params.vendor_id;

    if (!vendor_id || vendor_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var vendorItems = await Item.find({
        vendor: vendor_id,
      })
        .populate("category")
        .then((onVendorItemsFound) => {
          console.log("on vendor items found: ", onVendorItemsFound);
          res.json({
            message: "Vendor items found",
            status: "200",
            vendorItems: onVendorItemsFound,
          });
        })
        .catch((onVendorItemsFoundError) => {
          console.log("on vendor items found error: ", onVendorItemsFoundError);
          res.json({
            message: "Something went wrong while getting vendor items!",
            status: "400",
            error: onVendorItemsFoundError,
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

const getItemsByCategory = async (req, res) => {
  try {
    var category_id = req.params.category_id;

    if (!category_id || category_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var categorisedItems = await Item.find({
        category: category_id,
      })
        .populate(["category", "vendor"])
        .then((onCategoryItemsFound) => {
          console.log("on category items found: ", onCategoryItemsFound);
          res.json({
            message: "Category items found",
            status: "200",
            categoryItems: onCategoryItemsFound,
          });
        })
        .catch((onCategoryItemsFoundError) => {
          console.log(
            "on category items found error: ",
            onCategoryItemsFoundError
          );
          res.json({
            message: "Something went wrong while getting category items!",
            status: "400",
            onCategoryItemsFoundError,
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

const addItemToNecessities = async (req, res) => {
  try {
    var item_id = req.params.item_id;

    if (!item_id || item_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var filter = {
        _id: item_id,
      };

      var updatedData = {
        is_in_need: true,
      };

      var updatedItem = await Item.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onItemUpdate) => {
          console.log("on item update: ", onItemUpdate);

          res.json({
            message: "Item added to necessities!",
            status: "200",
            updatedItem: onItemUpdate,
          });
        })
        .catch((onItemUpdateError) => {
          console.log("on item update error: ", onItemUpdateError);
          res.json({
            message: "Something went wrong while adding item to necessities!",
            status: "400",
            error: onItemUpdateError,
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

const removeItemFromNecessities = async (req, res) => {
  try {
    var item_id = req.params.item_id;

    if (!item_id || item_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var filter = {
        _id: item_id,
      };

      var updatedData = {
        is_in_need: false,
      };

      var updatedItem = await Item.findByIdAndUpdate(filter, updatedData, {
        new: true,
      })
        .then((onItemUpdate) => {
          console.log("on item update: ", onItemUpdate);

          res.json({
            message: "Item added to necessities!",
            status: "200",
            updatedItem: onItemUpdate,
          });
        })
        .catch((onItemUpdateError) => {
          console.log("on item update error: ", onItemUpdateError);
          res.json({
            message: "Something went wrong while adding item to necessities!",
            status: "400",
            error: onItemUpdateError,
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

const getAllNecessaryItems = async (req, res) => {
  try {
    var items = await Item.find({
      is_in_need: true,
    })
      .populate(["vendor", "category"])
      .then((onItemsFound) => {
        console.log("on items found: ", onItemsFound);
        res.json({
          message: "Items found!",
          status: "200",
          allItems: onItemsFound,
        });
      })
      .catch((onItemsFoundError) => {
        console.log("on items found error: ", onItemsFoundError);
        res.json({
          message: "Something went wrong while getting all items!",
          status: "400",
          error: onItemsFoundError,
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
  createItem,
  getAllItems,
  getItemById,
  deleteItemById,
  getItemsByVendorId,
  getItemsByCategory,
  addItemToNecessities,
  removeItemFromNecessities,
  getAllNecessaryItems,
};
