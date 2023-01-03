import { useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useAccount, useDisconnect } from "wagmi";
import { siweContext as context } from "./siweProvider.js";
import { useSession } from "./useSession.js";

type UseSignOutOptions = Pick<UseQueryOptions<void>, "onSuccess" | "onError">

export const signOut = async () => {
  const res = await fetch("/api/auth/signout", { method: "POST" });
  if (!res.ok) throw new Error(res.statusText);
};

export const useSignOut = ({ onSuccess, onError }: UseSignOutOptions = {}) => {
  const { authenticated } = useSession();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient({ context });

  const { mutate, mutateAsync, ...rest } = useMutation(
    async () => {
      if (authenticated) await signOut();
      if (isConnected) await disconnectAsync();
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

  return { ...rest, signOut: mutate, SignOutAsync: mutateAsync };
};
