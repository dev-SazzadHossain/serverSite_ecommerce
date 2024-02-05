import jwt from "jsonwebtoken";
import { Register } from "../Models/register.model.js";
export const jwtInstance = async (req, res, next) => {
  try {
    // get token access token and header pass accessToken token
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "authorized Access" });
    }
    const verifyJwtToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!verifyJwtToken) {
      return res.send({ message: "Verify Failed" });
    }
    const user = await Register.findById(verifyJwtToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(401).send("Invalid User Token");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.send({ message: "Invalid Access User" });
  }
};
