import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import EventEmitter from "eventemitter3";
import { useEffect } from "react";
import { siweContext as context } from "./siweProvider.js";
import type { ApiResponse } from "./types.js";

const emitter = new EventEmitter();

export type UseSiweOptions = {
  onSignin?(): void;
  onSignout?(): void;
};

export const useSiwe = ({ onSignin, onSignout }: UseSiweOptions = {}) => {
  const queryClient = useQueryClient({ context });

  useEffect(() => {
    if (onSignin) emitter.addListener("signin", onSignin);
    if (onSignout) emitter.addListener("signout", onSignout);

    return () => {
      if (onSignin) emitter.removeListener("signin", onSignin);
      if (onSignout) emitter.removeListener("signout", onSignout);
    };
  }, [onSignin, onSignout]);

  const { data, isLoading } = useQuery(
    ["auth"],
    async () => {
      const { data } = await axios.get<ApiResponse>("/api/auth");
      return data;
    },
    { context }
  );

  const signin = async (message: string, signature: string) => {
    const { data } = await axios.post("/api/auth/signin", {
      message,
      signature,
    });
    queryClient.setQueryData(["auth"], data);
    emitter.emit("signin");
  };

  const signout = async () => {
    const { data } = await axios.post("/api/auth/signout");
    queryClient.setQueryData(["auth"], data);
    emitter.emit("signout");
  };

  const authenticated = !!data?.authenticated;
  const address = data?.address;
  const nonce = data?.nonce;

  return { isLoading, authenticated, address, nonce, signin, signout };
};
