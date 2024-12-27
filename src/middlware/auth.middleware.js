import jwt from "jsonwebtoken";
import { User } from "../modules/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
