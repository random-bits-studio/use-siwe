import { useQuery } from "@tanstack/react-query";
import { siweContext as context } from "./siweProvider.js";
import { GetSessionResponse } from "./types.js";

export const getSession = async () => {
  const res = await fetch("/api/auth");
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<GetSessionResponse>;
}

export const useSession = () => {
  const { data, ...rest } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    context,
  });

  return { ...rest, ...data };
};
