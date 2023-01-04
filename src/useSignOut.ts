import { useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useContext } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { parseOptions } from "./parseOptions.js";
import { optionsContext, queryContext } from "./siweProvider.js";
import { UseSiweOptions } from "./types.js";
import { useSession } from "./useSession.js";

type UseSignOutOptions = Pick<UseQueryOptions<void>, "onSuccess" | "onError">

export const signOut = async (options?: UseSiweOptions) => {
  const { baseUrl } = parseOptions(options);
  const res = await fetch(`${baseUrl}/signout`, { method: "POST" });
  if (!res.ok) throw new Error(res.statusText);
};

export const useSignOut = ({ onSuccess, onError }: UseSignOutOptions = {}) => {
  const { authenticated } = useSession();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient({
    context: queryContext,
  });
  const options = useContext(optionsContext);

  const { mutate, mutateAsync, ...rest } = useMutation(
    async () => {
      if (authenticated) await signOut(options);
      if (isConnected) await disconnectAsync();
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

  return { ...rest, signOut: mutate, SignOutAsync: mutateAsync };
};
