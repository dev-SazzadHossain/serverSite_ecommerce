import { uploadInstance } from "../Middleware/upload.middleware.js";
import { Register } from "../Models/register.model.js";
import { options } from "../Utils/options.js";
const logOutController = async (req, res) => {
  try {
    // find user and use middle ware jwt instance
    // findAndUpdate user refreshToken will be null and pass data
    const user = await Register.findByIdAndUpdate(
      req.user?._id,
      { $set: { refreshToken: null } },
      { new: true }
    );
    if (!user) {
      return res.status(401).send({ message: "Invalid Login Access" });
    }
    res
      .status(200)
      .cookie("accessToken", options)
      .cookie("refreshToken", options)
      .send({ success: true, message: "Log Out Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};

const uploadController = async (req, res) => {
  try {
    // get file multer middle ware
    // check fileLocal path
    // pass localPath cloudinary middle ware this file upload get data and set image is upload image url
    // then save user and return data user
    if (!req.file.path) {
      return res.send({ message: "image is required" });
    }
    const localPath = req.file?.path;
    if (localPath) {
      const updateImage = await uploadInstance(localPath);
      const url = updateImage?.url;
      const user = await Register.findById(req.user?._id).select(
        "-password -refreshToken"
      );
      user.image = url;
      user.save({ validateBeforeSave: false });
      if (user) {
        res.status(200).send({ success: true, data: user });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

const forgetController = async (req, res) => {
  try {
    // get oldPassword and newPassword
    // find user and compere old pass is match  isPasswordCorrect methods call
    // match this oldPassword save this password is new password
    const { oldPassword, newPassword } = req.body;
    if ([oldPassword, newPassword].some((filed) => filed == "")) {
      return res.send({ message: "all Filed is required" });
    }
    const user = await Register.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.send({ message: "Invalid old Password" });
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    const response = await Register.findById(user?._id).select(
      "-password -refreshToken"
    );
    if (response) {
      res.status(200).send({
        success: true,
        message: "Change Password SuccessFully",
        data: response,
      });
    }
  } catch (error) {
    res.send({ message: `Failed ${error?.message}` });
  }
};

export { logOutController, uploadController, forgetController };
