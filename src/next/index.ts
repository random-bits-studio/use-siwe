import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, methodNotAllowed, notFound, signIn, signOut } from "../api.js";

export const siweApi = () => async (req: NextApiRequest, res: NextApiResponse) => {
  let { route } = req.query;
  if (route instanceof Array) route = route[0];
  const { method } = req;

  switch (route) {
    case undefined:
      switch (method) {
        case "GET":
          return getSession(req, res);
        default:
          return methodNotAllowed(req, res);
      }

    case "signin":
      switch (method) {
        case "POST":
          return signIn(req, res);
        default:
          return methodNotAllowed(req, res);
      }

    case "signout":
      switch (method) {
        case "POST":
          return signOut(req, res);
        default:
          return methodNotAllowed(req, res);
      }

    default:
      return notFound(req, res);
  }
};
