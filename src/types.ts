import "iron-session";
import { Address } from "wagmi";
import { z } from "zod";

declare module "iron-session" {
  interface IronSessionData {
    address?: Address | undefined;
    nonce?: string | undefined;
  }
}

const siweMessageSchema = z.object({
  domain: z.string(),
  address: z.string(),
  statement: z.string().optional(),
  uri: z.string(),
  version: z.string(),
  chainId: z.number(),
  nonce: z.string(),
  issuedAt: z.string().optional(),
  expirationTime: z.string().optional(),
  notBefore: z.string().optional(),
  requestId: z.string().optional(),
  resources: z.array(z.string()).optional(),
});

export const signInRequestSchema = z.object({
  message: siweMessageSchema,
  signature: z.string(),
});

export type GetSessionResponse = {
  authenticated: boolean,
  address?: Address,
  nonce?: string,
};

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export type SignInResponse = string;

export type SignOutResponse = string;

export type UseSiweOptions = {
  baseUrl?: string,
};
