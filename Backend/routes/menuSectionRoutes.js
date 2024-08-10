const express = require("express");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/imagekitconfig");
const upload = multer({ storage: storage });
const { showMenu, createMenu, destroyMenu, addDish, destroyDish, updateMenu, editDish } = require("../controllers/menusectionController");


router.route("/")
    .get(wrapAsync(showMenu))
    .post(upload.single("myFile"), wrapAsync(createMenu));


router.route("/:id")
    .patch(upload.single("myFile"), wrapAsync(updateMenu))
    .delete(wrapAsync(destroyMenu));

router.route("/dish/:id")
    .post(upload.single("myFile"), wrapAsync(addDish))
    .patch(wrapAsync(editDish));

router.delete("/dish/:menuId/:dishId", destroyDish);



module.exports = router;