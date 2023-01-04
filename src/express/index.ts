import express from "express";
import { IronSessionOptions } from "iron-session";
import { ironSession } from "iron-session/express";
import { getSession, methodNotAllowed, notFound, signIn, signOut } from "../api.js";

export const authRouter = (ironOptions: IronSessionOptions) => {
  const router = express.Router();

  router.use(ironSession(ironOptions));

  router.route('/')
    .get(getSession)
    .all(methodNotAllowed);

  router.route('/signin')
    .post(signIn)
    .all(methodNotAllowed);

  router.route('/signout')
    .post(signOut)
    .all(methodNotAllowed);

  router.route('*')
    .all(notFound);

  return router;
};
