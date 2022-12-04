import type { NextApiRequest, NextApiResponse } from "next";
import getAuthStatus from "./getAuthStatus.js";
import signin from "./signin.js";
import signout from "./signout.js";

const methodNotAllowed = async (_: NextApiRequest, res: NextApiResponse) =>
  res.status(403).json({ error: "Method Not Allowed" });

const notFound = async (_: NextApiRequest, res: NextApiResponse) =>
  res.status(404).json({ error: "Not Found" });

export const siweApi = async (req: NextApiRequest, res: NextApiResponse) => {
  let { route } = req.query;
  if (route instanceof Array) route = route[0];
  const { method } = req;

  switch (route) {
    case undefined:
      switch (method) {
        case "GET":
          return await getAuthStatus(req, res);
        default:
          return await methodNotAllowed(req, res);
      }

    case "signin":
      switch (method) {
        case "POST":
          return await signin(req, res);
        default:
          return await methodNotAllowed(req, res);
      }

    case "signout":
      switch (method) {
        case "POST":
          return await signout(req, res);
        default:
          return await methodNotAllowed(req, res);
      }

    default:
      return await notFound(req, res);
  }
};
