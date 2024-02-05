import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URI}`);
    if (connectionInstance.connection.host) {
      console.log(
        "db Connection Successfully",
        connectionInstance.connection.host
      );
    }
  } catch (error) {
    console.log("dbConnection Failed Error", error.message);
  }
};
