import axios from "axios";
import { getToken } from "./utils";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Must set NEXT_PUBLIC_API_URL environment variable");
}

export const client = axios.create({
  baseURL: apiUrl,
});

export const authClient = axios.create({
  baseURL: apiUrl,
});

authClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
});
