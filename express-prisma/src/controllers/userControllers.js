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

// const createStaticData = async (req, res) => {
//   try {
//     const { staticD, dynamicD } = req.body;

//     // 1. Validate staticD
//     if (!staticD) {
//       return res.status(400).json({ error: "staticD data is missing" });
//     }

//     // 2. Validate dynamicD
//     if (!dynamicD || !Array.isArray(dynamicD) || dynamicD.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "dynamicD data is missing or empty" });
//     }

//     const { devID, hMAC, email, ssid, HwV, firmVer, RF } = staticD;

//     const existingDevice = await prisma.staticD.findFirst({
//       where: {
//         OR: [devID ? { devID } : undefined, hMAC ? { hMAC } : undefined].filter(
//           Boolean
//         ),
//       },
//     });

//     let staticDId;

//     if (existingDevice) {
//       // 4. Update existing device
//       const updatedStaticD = await prisma.staticD.update({
//         where: { id: existingDevice.id },
//         data: {
//           email,
//           ssid: ssid ? parseInt(ssid) : null,
//           HmV: HwV || null,
//           firmVer,
//           RF,
//         },
//       });
//       staticDId = updatedStaticD.id;
//     } else {
//       // 5. Create new device
//       const newStaticD = await prisma.staticD.create({
//         data: {
//           devID,
//           hMAC,
//           email,
//           ssid: ssid ? parseInt(ssid) : null,
//           HmV: HwV || null,
//           firmVer,
//           RF,
//         },
//       });
//       staticDId = newStaticD.id;
//     }

//     // 6. Create dynamicD entries with nested nodes in parallel
//     const createdDynamicDs = await Promise.all(
//       dynamicD.map(async (d) => {
//         return prisma.dynamicD.create({
//           data: {
//             batSoC: d.batSoC,
//             rssi: d.rssi,
//             epoch: d.epoch,
//             temp: d.temp,
//             humi: d.humi,
//             co: d.co,
//             pm25: d.pm25,
//             staticD: { connect: { id: staticDId } },
//             node: {
//               create:
//                 d.node && Array.isArray(d.node)
//                   ? d.node.map((n) => ({
//                       nMAC: n.nMAC,
//                       nAddr: n.nAddr,
//                       nRSSI: n.nRSSI,
//                       nT: n.nT,
//                       nH: n.nH,
//                       nBat: n.nBat,
//                       nEpoch: n.nEpoch,
//                     }))
//                   : [],
//             },
//           },
//           include: {
//             node: true,
//           },
//         });
//       })
//     );

//     return res.status(200).json({
//       statusCode: 200,
//       message: "Device data stored or updated successfully",
//       data: {
//         staticDId,
//         dynamicD: createdDynamicDs,
//       },
//     });
//   } catch (error) {
//     console.error("Error saving data:", error);
//     return res
//       .status(500)
//       .json({ error: error.message || "Internal server error" });
//   }
// };

const createStaticData = async (req, res) => {
  const { staticD, dynamicD } = req.body;

  if (!staticD?.devID) {
    return res.status(400).json({
      statusCode: 400,
      message: 'staticD.devID is required',
    });
  }

  try {
    // 1. Find or create StaticD
    let device = await prisma.staticD.findUnique({
      where: { devID: staticD.devID },
    });

    if (!device) {
      device = await prisma.staticD.create({
        data: {
          devID: staticD.devID,
          hMAC: staticD.hMAC,
          email: staticD.email,
          ssid: parseInt(staticD.ssid),
          HmV: staticD.HwV,
          firmVer: staticD.firmVer,
          RF: staticD.RF,
        },
      });
    }

    const insertedDynamics = [];

    // 2. Loop through dynamicD array
    for (const dyn of dynamicD) {
      const { node, ...dynFields } = dyn;

      const newDynamic = await prisma.dynamicD.create({
        data: {
          ...dynFields,
          staticDId: device.id,
        },
      });

      let createdNodes = [];

      // 3. If there are nodes, insert them
      if (Array.isArray(node) && node.length > 0) {
        createdNodes = await Promise.all(
          node.map((n) =>
            prisma.node.create({
              data: {
                ...n,
                dynamicDId: newDynamic.id,
              },
            })
          )
        );
      }

      insertedDynamics.push({
        ...newDynamic,
        node: createdNodes,
      });
    }

    // 4. Build thresholds per node.nAddr
    const allNodeThresholds = {};
    insertedDynamics.forEach((dyn) => {
      dyn.node.forEach((n) => {
        allNodeThresholds[n.nAddr] = {
          nT: [-30, 40],
          nH: [0, 99],
          nBat: [10, 100],
        };
      });
    });

    // 5. Final response
    return res.status(200).json({
      statusCode: 200,
      message: 'Data logged successfully',
      data: {
        dynamicD: insertedDynamics,
        reset: false,
        ota: false,
        interval: 1800,
        firmVer: device.firmVer || 0.1,
        ota_url: 'firmware/OTA_1.3.bin',
        thresholds: {
          hub: {
            batSoC: [10, 100],
            temp: [-30, 40],
            humi: [0, 99],
            co: [0, 200],
            pm25: [0, 500],
          },
          nodes: allNodeThresholds,
        },
        deletedNodeAddr: [],
      },
    });
  } catch (error) {
    console.error('Error inserting static + dynamic data:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
};

const getAllDeviceData = async (req, res) => {
  try {
    const data = await prisma.staticD.findMany({
      include: {
        dynamicD: {
          include: {
            node: true,
          },
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error("Error", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  registerController,
  getUserController,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
  loginController,
  getAllDeviceData,
  createStaticData,
};
