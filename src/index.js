import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import ConnectionDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

//routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

try {
  app.listen(PORT, () => {
    console.log(`♻️Application listening on Port: ${PORT}`);

    ConnectionDB();
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
