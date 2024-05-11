import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IGetAuthReqInfo } from "../utils/types";

interface TokenBearer {
  id: string;
}

export let tokenBearer: TokenBearer;

export const protect = async (
  req: IGetAuthReqInfo,
  res: Response,
  next: NextFunction
) => {
  let authHeader = req.headers.authorization as string;

  if (!authHeader) return res.status(401).json({ message: "Invalid token" });

  if (authHeader.toLowerCase().startsWith("bearer")) {
    authHeader = authHeader.slice("bearer".length).trim();
  }
  // const payload = req.cookies.payload;
  // const signature = req.cookies.signature;

  const token = authHeader
  // console.log(authHeader);
  jwt.verify(
    token,
    `${process.env.ACCESS_TOKEN_SECRET}`,
    (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: "Forbidden token", token });

      tokenBearer = decoded;

      // res.cookie("payload", authHeader, {
      //   sameSite: "lax",
      //   // domain: "localhost",
      //   // secure: true,
      //   maxAge: 24 * 60 * 60 * 1000,
      // });

      next();
    }
  );
};
