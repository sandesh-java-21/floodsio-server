const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    var { name, description } = req.body;

    if (!name || name === "" || !description || description === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var category = new Category({
        name,
        description,
      });

      var savedCategory = category
        .save()
        .then((onCategorySave) => {
          console.log("on category save: ", onCategorySave);
          res.json({
            message: "New category created!",
            status: "200",
            savedCategory: onCategorySave,
          });
        })
        .catch((onCategorySaveError) => {
          console.log("on category save error: ", onCategorySaveError);
          res.json({
            message: "Something went wrong while creating a new category!",
            status: "400",
            error: onCategorySaveError,
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

const getAllCategories = async (req, res) => {
  try {
    var categories = await Category.find()
      .then((onCategoriesFound) => {
        console.log("on categories found: ", onCategoriesFound);

        res.json({
          message: "Categories found!",
          status: "200",
          allCategories: onCategoriesFound,
        });
      })
      .catch((onCategoriesFoundError) => {
        console.log("on categories found error: ", onCategoriesFoundError);
        res.json({
          message: "Something went wrong while getting all categories!",
          status: "400",
          error: onCategoriesFoundError,
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

const updateCategoryById = async (req, res) => {
  try {
    var category_id = req.params.category_id;
    var { name, description } = req.body;

    if (!category_id || category_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var category = await Category.findById(category_id)
        .then(async (onCategoryFound) => {
          console.log("on category found: ", onCategoryFound);

          var filter = {
            _id: onCategoryFound._id,
          };

          var updatedData = {
            name,
            description,
          };

          var updatedCategory = await Category.findByIdAndUpdate(
            filter,
            updatedData,
            {
              new: true,
            }
          )
            .then(async (onCategoryUpdate) => {
              console.log("on category update: ", onCategoryUpdate);
              res.json({
                message: "Category Updated!",
                status: "200",
                updatedCategory: onCategoryUpdate,
              });
            })
            .catch(async (onCategoryUpdateError) => {
              console.log("on category update error: ", onCategoryUpdateError);
              res.json({
                message: "Something went wrong while updating category!",
                status: "400",
                error: onCategoryUpdateError,
              });
            });
        })
        .catch(async (onCategoryFoundError) => {
          console.log("on category found error: ", onCategoryFoundError);
          res.json({
            message: "Category not found!",
            status: "404",
            error: onCategoryFoundError,
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

const getCategoryById = async (req, res) => {
  try {
    var category_id = req.params.category_id;

    if (!category_id || category_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var category = await Category.findById(category_id)
        .then((onCategoryFound) => {
          console.log("on category found: ", onCategoryFound);
          res.json({
            message: "Category found!",
            status: "200",
            category: onCategoryFound,
          });
        })
        .catch((onCategoryFoundError) => {
          console.log("on category found error: ", onCategoryFoundError);
          res.json({
            message: "Category not found!",
            status: "404",
            error: onCategoryFoundError,
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
  createCategory,
  getAllCategories,
  updateCategoryById,
  getCategoryById,
};
