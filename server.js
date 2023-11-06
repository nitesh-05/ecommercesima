import express from "express";
import colors from "colors"; // Import 'colors' directly
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js";

import cors from "cors";
// import { Path, dirname } from 'path';

// const client = require("twilio")(accountSid, authToken);
// Create an instance of the Express app
const app = express();
// Config env
dotenv.config();

// Database config
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

colors.enabled = true; // Enable colors

// app.use("/api/v1/send-sms", (req, res) => {
//   console.log("called =======================");
//   const data = sendTiwlioSms();
//   res.json(data);
// });

//auth routes
app.use("/api/v1/auth", authRoutes);

//twilio routes
app.use("/api/v1/tiwlio", twilioRoutes);

//category routes

app.use("/api/v1/category", categoryRoutes);
//product routes

app.use("/api/v1/product", productRoutes);

// //static files
// app.use(express.static(path.join(--dirname,'./client/build')));

// app.get("*", function(req,res){
//     res.SendFile(path.join(--dirname,'./client/build/index.html'));
// });
// Rest API
app.get("/", (req, res) => {
  res.send("Welcome to shop online e-commerce app");
});

// PORT
const PORT = process.env.PORT || 8080;

// RUN LISTEN
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.bgCyan
      .white
  );
});

const sendTiwlioSms = () => {
  client.messages
    .create({
      body: "Hello from twilio-node",
      to: "+919835113943", // Recipient's phone number
      from: process.env.PH_NUMBER, // Your Twilio phone number
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.error("Error sending SMS:", error));
};
