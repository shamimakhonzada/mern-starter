const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const app = express();
const cors  = require("cors")

dotenv.config();
app.use(cors())
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
