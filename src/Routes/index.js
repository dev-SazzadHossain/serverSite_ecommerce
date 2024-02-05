import express from "express";
import { router } from "../Api/index.js";
const route = express.Router();

route.use(process.env.API, router);

export { route };
