import express from 'express';
import colors from 'colors'; // Import 'colors' directly
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors'

// Create an instance of the Express app
const app = express();

// Config env
dotenv.config();

// Database config
connectDB();

// Middleware
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

colors.enabled = true; // Enable colors


//auth routes
app.use("/api/v1/auth", authRoutes);

//category routes

app.use("/api/v1/category", categoryRoutes);
//product routes

app.use("/api/v1/product", productRoutes);


// Rest API
app.get('/', (req, res) => {
    res.send("Welcome to e-commerce app");
});

// PORT
const PORT = process.env.PORT || 8080;

// RUN LISTEN
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.bgCyan.white);
});
