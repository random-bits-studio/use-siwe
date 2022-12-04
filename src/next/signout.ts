import type { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";

export default async function signout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  req.session.nonce = generateNonce();
  req.session.address = undefined;
  await req.session.save();

  return res.json({
    authenticated: false,
    nonce: req.session.nonce,
  });
}
