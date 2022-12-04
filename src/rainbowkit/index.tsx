import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from '@rainbow-me/rainbowkit';
import React, { PropsWithChildren } from 'react';
import { useSiwe } from '@randombits/use-siwe';
import { SiweMessage } from 'siwe';

const RainbowKitUseSiweProvider = ({ children }: PropsWithChildren) => {
  const { isLoading, authenticated, nonce, signin, signout } = useSiwe();
  const adapter = createAuthenticationAdapter({
    createMessage: ({ address, chainId, nonce }) => {
      return new SiweMessage({
        address,
        chainId,
        nonce,
        domain: window.location.host,
        uri: window.location.origin,
        version: '1',
      });
    },

    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },

    getNonce: async () => {
      if (!nonce) throw new Error('Nonce is not defined');
      return nonce;
    },

    signOut: async () => {
      if (!signout) throw new Error('Auth not ready');
      await signout();
    },

    verify: async ({ message, signature }) => {
      if (!signin) throw new Error('Auth not ready');

      try {
        await signin(JSON.stringify(message), signature);
        return true;
      } catch (_error) {
        return false;
      }
    },
  });

  const status = isLoading ? 'loading' : authenticated ? 'authenticated' : 'unauthenticated';

  return (
    <RainbowKitAuthenticationProvider adapter={adapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  );
};

export default RainbowKitUseSiweProvider;
