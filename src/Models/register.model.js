import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const registerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin", "editor", "user"],
      default: "user",
    },
    image: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//------------------- bcrypt password -----------------
registerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//------------------- bcrypt password -----------------
//------------------- methods create password correct ----------------
registerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
//------------------- methods create password correct -----------------
//------------------- methods create accessToken  -----------------
registerSchema.methods.createAccessToken = async function () {
  return await jwt.sign(
    { _id: this._id, email: this.email, firstName: this.firstName },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
//------------------- method create accessToken  -----------------
//------------------- methods refreshToken   -----------------
registerSchema.methods.createRefreshToken = async function () {
  return await jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
//------------------- methods refreshToken -----------------

export const Register = mongoose.model("Register", registerSchema);
