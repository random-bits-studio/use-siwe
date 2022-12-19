# Use SIWE

Use-siwe is a library that provides a react hook and a set API endpoints that
make it dead simple to add Sign-In with Ethereum functionality to your react
application.

## Installation

To install `use-siwe` and it's dependencies run the following command:

```
npm install @randombits/use-siwe iron-session
```

## Getting Started

### Configure settings for `iron-session`

`lib/ironOptions.ts`
https://github.com/vvo/iron-session#ironoptions

```
import { IronSessionOptions } from 'iron-session';

if (!process.env.IRON_SESSION_PASSWORD)
  throw new Error('IRON_SESSION_PASSWORD must be set');

const ironOptions: IronSessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    address?: string | undefined;
    nonce?: string | undefined;
  }
}

export default ironOptions;
```

https://github.com/vvo/iron-session#typing-session-data-with-typescript

### Setting up the API routes

#### Next.js

Copy and past the following code into `pages/api/auth/[[...route]].ts`:

```
import { withIronSessionApiRoute } from "iron-session/next";
import ironOptions from "lib/ironOptions";
import { siweApi } from "@randombits/use-siwe/next"

export default withIronSessionApiRoute(siweApi, ironOptions);
```

#### Express.js

_Comming Soon_

### Wrapping your application with `SiweProvider`

Any compomnent that uses the `useSiwe` hook must be wrapped with the
`SiweProvider` component. For a Next.js application we recommend doing so in
`pages/_app.tsx` like in the example below:

```
import type { AppProps } from 'next/app';
import { SiweProvider } from '@randombits/use-siwe';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <SiweProvider>
    <Component {...pageProps} />
  </SiweProvider>;
}
```

### The hook

#### Checking if a user is authenticated

Check to see is a user is authenticated within a component by checking the
return values from `useSiwe` like the example below:

```
import { useSiwe } from "@randombits/use-siwe";

export const AuthCheck = () => {
  const { isLoading, authenticated, address } = useSiwe();

  if (isLoading) return <p>Loading...</p>;
  if (!authenticated) return <p>Not authenticated</p>;
  return <p>{address} is Authenticated</p>;
}

```

#### Signing In

#### Signing Out

Log the user out by calling the `signout` function returned by the `useSiwe`
hook:

```
import { useSiwe } from "@randombits/use-siwe";

export const SignOutButton = () => {
  const { signout } = useSiwe();

  return <button onClick={signout}>Sign Out</button>;
}
```

## API

### useSiwe

### SiweProvider

### Next.js: SiweApi

### Express.js: SiweApi
