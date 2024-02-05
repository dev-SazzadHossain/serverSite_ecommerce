import { Register } from "../Models/register.model.js";
export const registerController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      telephone,
      address1,
      address2,
      city,
      division,
      district,
      password,
      repeatPassword,
    } = req.body;
    if (
      [
        firstName,
        lastName,
        email,
        telephone,
        address1,
        address2,
        city,
        district,
        division,
        password,
        repeatPassword,
      ].some((field) => field === "")
    ) {
      return res.send({ message: "All Fields Required" });
    }

    const existingUser = await Register.find({ email });

    if (existingUser.length) {
      return res.send({ success: true, message: "Already Have An Account " });
    }
    const response = await Register.create({
      firstName,
      lastName,
      email,
      telephone,
      address1,
      address2,
      city,
      division,
      district,
      password,
    });
    if (!response) {
      return res.send({ message: "Something Wrong" });
    }
    const user = await Register.findById(response?._id).select(
      "-password -refreshToken"
    );
    res.send({ success: true, message: "Register Successfully", data: user });
  } catch (error) {
    console.log(error.message);
  }
};
export const singleRegisterController = async (req, res) => {
  const findUser = await Register.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (findUser) {
    res.status(200).send({ success: true, data: findUser });
  }
};
