import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { parseOptions } from "./useOptions.js";
import { queryContext, optionsContext } from "./siweProvider.js";
import { GetSessionResponse, UseSiweOptions } from "./types.js";

export const getSession = async (options?: UseSiweOptions) => {
  const { baseUrl } = parseOptions(options);
  const res = await fetch(baseUrl);
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<GetSessionResponse>;
}

export const useSession = () => {
  const options = useContext(optionsContext);
  const { data, ...rest } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(options),
    context: queryContext,
  });

  return { ...rest, ...data };
};
