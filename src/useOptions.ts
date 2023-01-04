import { useContext } from "react";
import { optionsContext } from "./siweProvider.js";
import { UseSiweOptions } from "./types.js"

const defaultOptions: Required<UseSiweOptions> = {
  baseUrl: "/api/auth",
}

export const parseOptions = (options: UseSiweOptions = {}) => {
  return { ...defaultOptions, ...options };
}

export const useOptions = () => {
  const options = useContext(optionsContext);
  return parseOptions(options);
}
