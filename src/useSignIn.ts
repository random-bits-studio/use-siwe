import { useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { siweContext as context } from "./siweProvider.js";
import { useSession } from "./useSession.js";

type UseSignInOptions = Pick<UseQueryOptions<void>, "onSuccess" | "onError">

export const createMessage = (options: { address: string, chainId: number, nonce: string }) =>
  new SiweMessage({
    ...options,
    domain: window.location.host,
    uri: window.location.origin,
    version: "1",
  });

export const getMessageBody = ({ message }: { message: SiweMessage }) =>
  message.prepareMessage();

export const verify = async ({ message, signature}: { message: string, signature: string }) => {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ message, signature }),
  });

  return res.ok;
}

export const useSignIn = ({ onSuccess, onError }: UseSignInOptions = {}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { nonce } = useSession();
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient({ context });

  const { mutate, mutateAsync, ...rest } = useMutation(
    async () => {
      const rawMessage = createMessage({ address, chainId: chain.id, nonce });
      const message = getMessageBody({ message: rawMessage });
      const signature = await signMessageAsync({ message });
      const result = await verify({ message, signature });
      if (!result) throw new Error("Verification Failed");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["session"] });
        if (onSuccess) onSuccess();
      },
      onError,
      context,
    },
  );

  return { ...rest, signIn: mutate, SignInAsync: mutateAsync };
};
