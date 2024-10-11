import axios from "axios";
import { getBasicToken, getToken } from "./utils";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const n8nApiUrl = process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL;

if (!apiUrl) {
  throw new Error("Must set NEXT_PUBLIC_API_URL environment variable");
}

export const client = axios.create({
  baseURL: apiUrl,
});

export const authClient = axios.create({
  baseURL: apiUrl,
});

export const n8nClient = axios.create({
  baseURL: n8nApiUrl,
});

authClient.interceptors.request.use(
  config => {
    const token = getToken() ?? process.env.PROMPTIFY_TOKEN;

    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
  },
  err => console.log("error"),
);

// n8nClient.interceptors.request.use(
//   async config => {
//     const { token } = await getBasicToken();
//     if (!token) throw new Error("You are not authorized to execute this AI app workflow");
//     config.headers["Authorization"] = `Basic ${token}`;

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );
