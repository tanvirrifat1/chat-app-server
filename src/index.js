import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import ConnectionDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config();
const app = express();

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
  app.listen(PORT, () => {
    console.log(`♻️Application listening on Port: ${PORT}`);

    ConnectionDB();
  });
} catch (error) {
  console.error("Error starting the server:", error);
}

// MONGO_URL=mongodb+srv://chat-app:lNoKRjX1JNQBYwxl@cluster0.afkplob.mongodb.net/chat-app?retryWrites=true&w=majority&appName=Cluster0

// PORT=5000
// IP_ADDRESS=192.168.12.206
// JWT_SECRET=secreart1524

// NODE_ENV=development

// CLOUDINARY_CLOUD_NAME=dvi9q02vy
// CLOUDINARY_API_KEY=655866963586852
// CLOUDINARY_API_SECRET=fcdXMYoLeoTudqthm8ZUbCZcxc0
