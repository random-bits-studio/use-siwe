# Use SIWE

Use-siwe is a library that provides react hooks and API endpoints that make it
dead simple to add Sign-In with Ethereum functionality to your react
application.

### Works with RainbowKit

The easiest way to use this library is with RainbowKit!
Check out the RainbowKit authentication adapter for use-siwe here:
https://github.com/random-bits-studio/rainbowkit-use-siwe-auth

# Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Configure settings for iron-session](#configure-settings-for-iron-session)
  - [Setting up the API routes](#setting-up-the-api-routes)
    - [Next.js](#nextjs)
    - [Express.js](#expressjs)
  - [Wrapping your application with SiweProvider](#wrapping-your-application-with-siweprovider)
  - [Using the hooks](#using-the-hooks)
    - [Checking if a user is authenticated](#checking-if-a-user-is-authenticated)
    - [Signing In](#signing-in)
    - [Signing Out](#signing-out)
- [API](#api)
  - [Types](#types)
    - [UseSiweOptions](#usesiweoptions)
  - [Components](#components)
    - [SiweProvider](#siweprovider)
  - [Hooks](#hooks)
    - [useSession](#usesession)
    - [useSignIn](#usesignin)
    - [useSignOut](#usesignout)
    - [useOptions](#useoptions)
  - [Routes](#routes)
    - [Next.js: SiweApi](#nextjs-siweapi)
    - [Express.js: SiweApi](#expressjs-siweapi)
  - [Functions](#functions)
    - [getSession](#getsession)
    - [createMessage](#createmessage)
    - [getMessageBody](#getmessagebody)
    - [verify](#verify)
    - [signOut](#signout)

# Installation

To install `use-siwe` and it's dependencies run the following command:

```
npm install @randombits/use-siwe wagmi ethers iron-session
```

# Getting Started

## Configure settings for `iron-session`

For full reference of possible options see:
https://github.com/vvo/iron-session#ironoptions

```
// lib/ironOptions.ts

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

**Typing session data**
The type definition of `IronSessionData` in the example above provides a type
definition to the data passed to api functions in `req.session`. `address` and
`nonce` are used and set by use-siwe; if you plan on storing other data in the
session, feel free to add additional types here.

For more information see:
https://github.com/vvo/iron-session#typing-session-data-with-typescript

## Setting up the API routes

### Next.js

Copy and past the following code into `pages/api/auth/[[...route]].ts`:

```
import { withIronSessionApiRoute } from "iron-session/next";
import ironOptions from "lib/ironOptions";
import { siweApi } from "@randombits/use-siwe/next"

export default withIronSessionApiRoute(siweApi(), ironOptions);
```

### Express.js

To add auth routes to your existing express API, add the following:

```
import express from "express";
import { ironSession } from "iron-session/express";
import ironOptions from "./ironOptions.js";
import { authRouter } from "@randombits/use-siwe/express";

const app = express();

// Add iron session middleware before all routes that will use session data
app.use(ironSession(ironOptions));

// Your existing api routes here...

// Add use-siwe auth routes
app.use('/auth', authRouter());

app.listen(3001);

```

## Wrapping your application with `SiweProvider`

Any component that uses the any of the use-siwe hooks must be wrapped with the
`SiweProvider` component. For a Next.js application we recommend doing so in
`pages/_app.tsx` like in the example below:

```
// pages/_app.tsx

import type { AppProps } from 'next/app';
import { SiweProvider } from '@randombits/use-siwe';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <SiweProvider>
    <Component {...pageProps} />
  </SiweProvider>;
}
```

## Using the hooks

### Checking if a user is authenticated

Check to see is a user is authenticated with the `useSession` hook like in the
example below:

```
import { useSession } from "@randombits/use-siwe";

export const AuthCheck = () => {
  const { isLoading, authenticated, address } = useSession();

  if (isLoading) return <p>Loading...</p>;
  if (!authenticated) return <p>Not authenticated</p>;
  return <p>{address} is Authenticated</p>;
};
```

### Signing In

Login the user by calling the `signIn` function returned by the `useSignIn`
hook:

```
import { useSignIn } from "@randombits/use-siwe";

const SignInButton = () => {
  const { signIn, isLoading } = useSignIn();
  return <button onClick={() => signIn()} disabled={isLoading}>Sign In with Ethereum</button>;
};
```

### Signing Out

Logout the user by calling the `signOut` function returned by the `useSignOut`
hook:

```
import { useSignOut } from "@randombits/use-siwe";

const SignOutButton = () => {
  const { signOut, isLoading } = useSignOut();
  return <button onClick={() => signOut()} disabled={isLoading}>Sign Out</button>;
};
```

# API

## Types

### UseSiweOptions

Use-siwe accepts an object of options. Currently this consists of one optional
setting:

#### Usage

```
const options: UseSiweOptions = {
  baseUrl: "/v2/api/auth",
};
```

#### Options

- `baseUrl`, optional: The base url for the auth API endpoints that is
  prepended to all requests. Defaults to: `/api/auth`

## Components

### SiweProvider

Context provider component that must wrap all components that use `useSession`,
`useSignIn`, `useSignOut`, or `useOptions` hooks.

#### Usage

```
import type { AppProps } from 'next/app';
import { SiweProvider } from '@randombits/use-siwe';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <SiweProvider>
    <Component {...pageProps} />
  </SiweProvider>;
}
```

#### Props

- `options`, Optional: A `UseSiweOptions` object.

## Hooks

### useSession

A hook that returns the the current state of the users session.

#### Usage

```
import { useSession } from "@randombits/use-siwe";

export const Component = () => {
  const { isLoading, authenticated, address } = useSession();

  if (isLoading) return <div>Loading...</div>;
  if (!authenticated) return <div>Not Signed In</div>;
  return <div>Hello, {address}!</div>;
};
```

#### Return Value

Returns a `UseQueryResult` ([ref](https://tanstack.com/query/latest/docs/react/reference/useQuery))
augmented with the following:

```
{
  authenticated: boolean;
  address?: string;
  nonce?: string;
} & UseQueryResult
```

### useSignIn

A hook that returns a `signIn` function that will initiate a SIWE flow, as well
as the status of that signIn process.

#### Usage

```
import { useSignIn } from "@randombits/use-siwe";

const SignInButton = () => {
  const { signIn, isLoading } = useSignIn();
  return <button onClick={() => signIn()} disabled={isLoading}>Sign In with Ethereum</button>;
};
```

#### Options

```
{
  onSuccess: () => void,
  onError: () => void,
}
```

#### Return Value

Returns a `UseMutationResult` ([ref](https://tanstack.com/query/latest/docs/react/reference/useMutation))
augmented with the following:

```
{
  signIn: () => void,
  SignInAsync: () => Promise<void>,
} & UseMutationResult
```

### useSignOut

A hook that returns a `signOut` function that when called will sign out the
current user and disconnect their wallet.

#### Usage

```
import { useSignOut } from "@randombits/use-siwe";

const SignOutButton = () => {
  const { signOut, isLoading } = useSignOut();
  return <button onClick={() => signOut()} disabled={isLoading}>Sign Out</button>;
};
```

#### Options

```
{
  onSuccess: () => void,
  onError: () => void,
}
```

#### Return Value

Returns a `UseMutationResult` ([ref](https://tanstack.com/query/latest/docs/react/reference/useMutation))
augmented with the following:

```
{
  signOut: () => void,
  SignOutAsync: () => Promise<void>,
} & UseMutationResult
```

### useOptions

A hook that simply returns the options that have been set by in the
`SiweProvider` component.

#### Usage

```
import { useOptions, verify } from "@randombits/use-siwe";

const verifyButton = (props) => {
  const options = useOptions();
  const handleClick = () => verify({
    message: props.message,
    signature: props.signature,
  }, options);

  return <button onClick={() => handleClick()}>Verify Signature</button>;
};
```

#### Return Value

```
useSiweOptions
```

## Routes

### Next.js: SiweApi

A function that returns a `NextApiHandler` that will handle all auth API
routes.

#### Usage

```
import { withIronSessionApiRoute } from "iron-session/next";
import ironOptions from "lib/ironOptions";
import { siweApi } from "@randombits/use-siwe/next"

export default withIronSessionApiRoute(siweApi(), ironOptions);
```

#### Return Value

```
NextApiHandler
```

### Express.js: SiweApi

A function that returns an express `Router` that will handle all auth API
routes.

#### Usage

```
import express from "express";
import { ironSession } from "iron-session/express";
import ironOptions from "./ironOptions.js";
import { authRouter } from "@randombits/use-siwe/express";

const app = express();

app.use(ironSession(ironOptions));
app.use('/auth', authRouter());

app.listen(3001);
```

#### Return Value

```
Router
```

## Functions

### getSession

A function to retrieve the session data where using a hook doesn't make sense.

#### Usage

```
import { getSession } from "@randombits/use-siwe";

const addressOrNull = async () => {
  const { address } = await getSession();
  if (!address) return null;
  return address;
};
```

#### Args

- `options?: UseSiweOptions`

#### Return Value

```
{
  authenticated: boolean;
  address?: string;
  nonce?: string;
}
```

### createMessage

Returns a `SiweMessage` for the given address, chainId, and nonce.

#### Usage

```
import { createMessage, getMessageBody } from "@randombits/use-siwe";

const debugMessage = (address, chainId, nonce) => {
  const message = createMessage({ address, chainId, nonce });
  const messageBody = getMessageBody({ message });
  console.log({ message, messageBody });
};
```

#### Args

- `args: MessageArgs`

```
type MessageArgs = {
  address: string,
  chainId: number,
  nonce: string,
};
```

#### Return Value

```
SiweMessage
```

### getMessageBody

Returns a message ready to be signed according with the type defined in the
SiweMessage object.

#### Usage

```
import { createMessage, getMessageBody } from "@randombits/use-siwe";

const debugMessage = (address, chainId, nonce) => {
  const message = createMessage({ address, chainId, nonce });
  const messageBody = getMessageBody({ message });
  console.log({ message, messageBody });
};
```

#### Args

- `args: { message: SiweMessage }`

#### Return Value

```
string
```

### verify

Takes a message and a signature as arguments and attempts to verify them using
the auth API. A successful verification will create a session for the user.

#### Usage

```
import { verify } from "@randombits/use-siwe";

const verifyButton = (props) => {
  const handleClick = () => {
    const success = verify({
      message: props.message,
      signature: props.signature,
    });

    if (!success) return console.error("VERIFICATION FAILED");
    console.log("SIGNATURE VERIFIED");
  };

  return <button onClick={() => handleClick()}>Verify Signature</button>;
};
```

#### Args

- `args: VerifyArgs`
- `options?: UseSiweOptions`

```
type VerifyArgs = {
  message: SiweMessage,
  signature: string,
};
```

#### Return Value

```
boolean
```

### signOut

A function to sign out the user where using a hook doesn't make sense.

#### Usage

```
import { signOut } from "@randombits/use-siwe";

// Logout a user after 1 hour
setTimeout(async () => {
  await signOut();
  window.location.href = "/session-expired";
}, 60 * 60 * 1000);
```

#### Args

- `options?: UseSiweOptions`

#### Return Value

```
Promise<void>
```
