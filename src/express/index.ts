import express from "express";
import { getSession, methodNotAllowed, notFound, signIn, signOut } from "../api.js";

const router = express.Router();

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

export default router;
