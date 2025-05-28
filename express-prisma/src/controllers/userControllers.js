const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registering user:", name, email);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
const getUserController = async (req, res) => {
  try {
    const userList = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    res.status(200).json(userList);
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User by Email Error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
const updateUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { name, password } = req.body;

    // Hash the password if provided
    let updatedData = {};
    if (name) updatedData.name = name;
    if (password) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: updatedData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
const deleteUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Delete user by email
    const deletedUser = await prisma.user.delete({
      where: { email: email },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: {
        id: deletedUser.id,
        name: deletedUser.name,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    console.error("Delete Error:", error.message);

    // Handle case if user not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // You can add session/cookie/token logic here if needed

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

module.exports = {
  registerController,
  getUserController,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
  loginController,
};
