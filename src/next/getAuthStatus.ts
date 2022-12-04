import type { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";

export default async function getAuthStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.session.address) {
    return res.json({
      authenticated: true,
      address: req.session.address,
    });
  }

  if (!req.session.nonce) {
    req.session.nonce = generateNonce();
    await req.session.save();
  }

  return res.json({
    authenticated: false,
    nonce: req.session.nonce,
  });
}
