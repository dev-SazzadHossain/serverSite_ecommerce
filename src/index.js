import { dbConnection } from "./DBconnection/dbConnection.js";
import { app } from "./app.js";

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8000);
    console.log(`server is running PORT:${process.env.PORT}`);
  })
  .catch((err) => console.log(err.message));
