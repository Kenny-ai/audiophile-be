import { Request, Response } from "express";
import User from "../model/User";
import bcrypt from "bcryptjs";
import { IGetAuthReqInfo } from "../utils/types";

export const login = async (req: IGetAuthReqInfo, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });

  try {
    const user = await User.findOne({ email }).exec();

    if (!user)
      return res.status(401).json({ message: `Invalid login credentials` });

    // evaluate password
    const match = await user.matchPassword(password);

    if (!match) return res.status(401).json({ message: `Invalid password` });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const sendTokenResponse = async (
  user: any,
  statusCode: number,
  res: Response
) => {
  const token = user.getSignedAccessToken();

  const { _id, name, email } = user;

  res.status(statusCode).json({
    success: true,
    user: { _id, name, email },
    // user: { name: user.name },
    token,
  });
};

export const logout = async (req: Request, res: Response) => {
  try {
    // if (!user) {
    //   return res.status(403).json({ message: "user is not logged in" });
    // }
    res.clearCookie("payload");
    res.clearCookie("signature");

    res.status(200).json({ message: "successfully logged out" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });

  const duplicate = await User.findOne({ email }).exec();

  if (duplicate)
    return res.status(409).json({ message: `User already exists` });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

// export const refresh = async (req: Request, res: Response) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken)
//     return res.status(401).json({ message: "No cookie detected" });

//   try {
//     const user = await User.findOne({ refreshToken }).exec();

//     if (!user) return res.sendStatus(403);
//     jwt.verify(
//       refreshToken,
//       `${process.env.REFRESH_TOKEN_SECRET}`,
//       (err: any, decoded: any) => {
//         if (err || user._id !== decoded.id)
//           return res.sendStatus(403).json({ message: "Invalid refresh token" });
//         const accessToken = jwt.sign(
//           { id: decoded.id },
//           `${process.env.ACCESS_TOKEN_SECRET}`,
//           { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}` }
//         );
//         res.json({ accessToken });
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// };
