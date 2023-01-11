import { useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useContext } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { parseOptions } from "./useOptions.js";
import { optionsContext, queryContext } from "./siweProvider.js";
import { UseSiweOptions } from "./types.js";
import { useSession } from "./useSession.js";

type UseSignInOptions = Pick<UseQueryOptions<void>, "onSuccess" | "onError">
type MessageArgs = {
  address: string,
  chainId: number,
  nonce: string,
};
type VerifyArgs = {
  message: string,
  signature: string,
};

export const createMessage = (args: MessageArgs) =>
  new SiweMessage({
    ...args,
    domain: window.location.host,
    uri: window.location.origin,
    version: "1",
  });

export const getMessageBody = ({ message }: { message: SiweMessage }) =>
  message.prepareMessage();

export const verify = async (args: VerifyArgs, options?: UseSiweOptions) => {
  const { baseUrl } = parseOptions(options);
  const res = await fetch(`${baseUrl}/signin`, {
    headers: { 'Content-Type': 'application/json' },
    method: "POST",
    body: JSON.stringify(args),
  });

  return res.ok;
}

export const useSignIn = ({ onSuccess, onError }: UseSignInOptions = {}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { nonce } = useSession();
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient({
    context: queryContext,
  });
  const options = useContext(optionsContext);

  const { mutate, mutateAsync, ...rest } = useMutation(
    async () => {
      const rawMessage = createMessage({ address, chainId: chain.id, nonce });
      const message = getMessageBody({ message: rawMessage });
      const signature = await signMessageAsync({ message });
      const result = await verify({ message, signature }, options);
      if (!result) throw new Error("Verification Failed");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["session"] });
        if (onSuccess) onSuccess();
      },
      onError,
      context: queryContext,
    },
  );

  return { ...rest, signIn: mutate, SignInAsync: mutateAsync };
};
