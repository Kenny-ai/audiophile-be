import {
  getAllUsers,
  login,
  logout,
  // refresh,
  register,
} from "../controllers/auth";

const express = require("express");
const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/logout", logout);
// authRouter.get("/refresh", refresh);
authRouter.post("/register", register);
authRouter.get("/all_users", getAllUsers);

export default authRouter;