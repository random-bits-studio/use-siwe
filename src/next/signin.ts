import type { NextApiRequest, NextApiResponse } from "next";
import { SiweMessage } from "siwe";

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nonce } = req.session;
  const message = new SiweMessage(JSON.parse(req.body.message));
  const { signature } = req.body;

  if (!message || !signature || !nonce)
    return res.status(400).json({ error: "Bad Request" });

  const { success, data, error } = await message.verify({
    signature,
    nonce,
    // domain, // TODO: verify domain is correct too
  });

  if (!success && error) return res.status(500).json({ error: error.type }); // TODO: Better status code

  if (!success) return res.status(500).json({ error: "Unknown Error" });

  req.session.nonce = undefined;
  req.session.address = data.address;
  await req.session.save();

  return res.json({
    authenticated: true,
    address: data.address,
  });
}
