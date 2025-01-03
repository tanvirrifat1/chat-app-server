import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import ConnectionDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

import { server, app } from "./lib/socket.js";

dotenv.config();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

//routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

try {
  server.listen(PORT, () => {
    console.log(`♻️Application listening on Port: ${PORT}`);

    ConnectionDB();
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
