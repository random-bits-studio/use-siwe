import "iron-session";

type AuthenticatedResponse = {
  authenticated: true;
  address: string;
  nonce: undefined;
};

type UnauthenticatedResponse = {
  authenticated: false;
  address: undefined;
  nonce: string;
};

export type ApiResponse = AuthenticatedResponse | UnauthenticatedResponse;

declare module "iron-session" {
  interface IronSessionData {
    address?: string | undefined;
    nonce?: string | undefined;
  }
}
