import type { IncomingMessage, ServerResponse } from 'http';
import { generateNonce, SiweMessage } from 'siwe';
import { fromZodError } from 'zod-validation-error';
import { GetSessionResponse, signInRequestSchema, SignInResponse, SignOutResponse } from './types.js';

interface Request extends IncomingMessage {
  body: any;
}

interface Response<T = any> extends ServerResponse {
  json: (body: T) => void;
  send: (body: T) => void;
  status: (statusCode: number) => Response;
}

type RequestHandler<T = any> = (req: Request, res: Response<T>) => void;

export const getSession: RequestHandler<GetSessionResponse> = async (req, res) => {
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
};

export const signIn: RequestHandler<SignInResponse> = async (req, res) => {
  const { nonce } = req.session;
  if (!nonce) return res.status(400).send("Bad Request");

  const parsedBody = signInRequestSchema.safeParse(req.body);
  if (!parsedBody.success) {
    const error = fromZodError(parsedBody.error);
    return res.status(400).send(error.message);
  }
  const { message, signature } = parsedBody.data;

  const { success, error, data } = await new SiweMessage(message).verify({
    signature,
    nonce,
    // domain, // TODO: verify domain is correct too
  });

  if (!success && error) return res.status(400).send(error.type);
  if (!success) return res.status(500).send("Unknown Error");

  req.session.nonce = undefined;
  req.session.address = data.address;
  await req.session.save();

  return res.send("OK");
};

export const signOut: RequestHandler<SignOutResponse> = async (req, res) => {
  if (!req.session.address) return res.status(400).send("Bad Request");

  req.session.nonce = generateNonce();
  req.session.address = undefined;
  await req.session.save();

  return res.send("OK");
};

export const methodNotAllowed: RequestHandler = (_req, res) =>
  res.status(403).send("Method Not Allowed");

export const notFound: RequestHandler = (_req, res) =>
  res.status(404).send("Not Found");
