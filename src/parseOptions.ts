import { UseSiweOptions } from "./types.js"

const defaultOptions: Required<UseSiweOptions> = {
  baseUrl: "/api/auth",
}

export const parseOptions = (options: UseSiweOptions = {}) => {
  return { ...defaultOptions, ...options };
}
