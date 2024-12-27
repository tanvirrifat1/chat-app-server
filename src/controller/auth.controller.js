import { StatusCodes } from "http-status-codes";
import { User } from "../modules/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utilis.js";
import cloudinary from "../lib/cloudinary.js";

const signup = async (req, res) => {
  const { fullName, email, password, profileImage } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all fields." });
  }

  try {
    if (password.length < 6) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password must be at least 6 characters long." });
    }

    // Check if the email already exists
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const result = await User.create({
      fullName,
      email,
      profileImage,
      password: hashedPassword,
    });

    if (result) {
      // Generate token and respond
      generateToken(result._id, res);
      return res.status(StatusCodes.CREATED).json({
        message: "User created.",
        _id: result._id,
        fullName: result.fullName,
        email: result.email,
        profileImage: result.profileImage,
      });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not created." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `Please provide ${email} ${password}` });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password is incorrect." });
    }

    generateToken(user._id, res);
    return res.status(StatusCodes.OK).json({
      message: "Login successful.",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(StatusCodes.OK).json({ message: "Logout successful." });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, profileImage } = req.body;

    const userId = req.user._id;

    const uploadImage = await cloudinary.uploader.upload(profileImage);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, profileImage: uploadImage.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found." });
    }

    return res.status(StatusCodes.OK).json({
      message: "Profile updated successfully.",
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.status(StatusCodes.OK).json(req.user);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const authController = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
