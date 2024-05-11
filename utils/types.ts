import { Request } from "express";

interface User {
  id: string;
}

export interface IGetAuthReqInfo extends Request {
  user: User
}