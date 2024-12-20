const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
const path = require('path');

const dotenv = require('dotenv');
const userRoutes = require('./routes/userRouts');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', userRoutes);
app.use('/api/files', fileRoutes);
 app.use('/uploads',fileRoutes)

connectDB()
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));