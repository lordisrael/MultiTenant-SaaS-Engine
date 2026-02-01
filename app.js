require('dotenv').config();
const express = require('express');
const dbConnect = require("./config/database")
const helmet = require('helmet');
const cors = require('cors');

const app = express();

dbConnect();

app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    //await dbConnect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();