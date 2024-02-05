import { Register } from "../Models/register.model.js";
import { options } from "../Utils/options.js";
//!----------------- *****--------------generateAccessTokenRefreshToken---------****--------------!//
const generateAccessAndRefreshToken = async (id) => {
  const user = await Register.findById(id);
  const accessToken = await user.createAccessToken();
  const refreshToken = await user.createRefreshToken();
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
//!----------------- *****--------------generateAccessTokenRefreshToken---------****--------------!//
export const loginController = async (req, res) => {
  try {
    // get user data req.body
    // find user query user email and find user
    // check password correct or incorrect
    // generate access and refresh token and set cookie access token and refresh token
    // cookie option httpOnly:true and secure:true
    // send user response and with accessToken and refreshToken
    //*****------------------------------------------****---------------------------!//
    const { email, password } = req.body;
    const user = await Register.findOne({ email });
    if (!user) {
      return res.send({ message: "Wrong user auth Credential " });
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.send({ message: "Wrong user auth Credential " });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    if (!accessToken || !refreshToken) {
      return res.send({ message: "Wrong user auth Credential " });
    }
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login SuccessFully",
        data: { accessToken, refreshToken },
      });
  } catch (error) {
    console.log(error.message);
  }
};
