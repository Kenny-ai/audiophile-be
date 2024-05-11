import { Application } from "express";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions";
import authRouter from "./routes/auth";
import productRouter from "./routes/products";
import { credentials } from "./middleware/credentials";
import colors from "colors";
dotenv.config();

const PORT = process.env.PORT || 8000;

// connect to db
connectDB();

const app: Application = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// app.use("/api/v1/auth", authRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);

const message = {
  name: "Kenny",
  age: 22,
};

app.get("/", (req, res) => {
  res.json(message);
});

const server = app.listen(PORT, (): void =>
  console.log(`Server running on PORT ${PORT}`.magenta.bold)
);

// Handle Promise rejections
process.on("unhandledRejection", (err: Error, promise) => {
  console.error(err);
  console.log(`Error: ${colors.red(err.message)}`);
  // Close the server && exit the process
  server.close(() => process.exit(1));
});
