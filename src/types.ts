import "iron-session";
import { z } from "zod";

declare module "iron-session" {
  interface IronSessionData {
    address?: string | undefined;
    nonce?: string | undefined;
  }
}

export const signInRequestSchema = z.object({
  message: z.string(),
  signature: z.string(),
});

export type GetSessionResponse = {
  authenticated: boolean,
  address?: string,
  nonce?: string
};

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export type SignInResponse = string;

export type SignOutResponse = string;

export type UseSiweOptions = {
  baseUrl?: string,
};
