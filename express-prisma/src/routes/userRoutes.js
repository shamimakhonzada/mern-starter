const express = require("express");
const {
  registerController,
  getUserController,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
  loginController,
} = require("../controllers/userControllers.js");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/getUser", getUserController);
router.get("/userById/:email", getUserByEmail);
router.put("/userUpdate/:email", updateUserByEmail);
router.delete("/userDelete/:email", deleteUserByEmail);


module.exports = router;
