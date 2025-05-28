const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const app = express();
const cors  = require("cors")

dotenv.config();

app.use(express.json());
app.use(cors())
app.use('/api/users', userRoutes);
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
