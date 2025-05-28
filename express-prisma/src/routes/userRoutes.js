const express = require("express");
const {
  registerController,
  getUserController,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
} = require("../controllers/userControllers.js");

const router = express.Router();

router.post("/register", registerController);
router.get("/getUser", getUserController);
router.get("/userById/:email", getUserByEmail);
router.put("/userUpdate/:email", updateUserByEmail);
router.delete("/userDelete/:email", deleteUserByEmail);


module.exports = router;
