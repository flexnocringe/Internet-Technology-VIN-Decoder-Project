require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const connectDB = require('./config/db');
const authRoutes = require('./routes/AuthRoutes');
const vinRoutes = require('./routes/VinRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vin', vinRoutes);

connectDB();

const PORT = process.env.PORT;
const keyPath = process.env.KEY_PATH;
const certPath = process.env.CERT_PATH;

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
});