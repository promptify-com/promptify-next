import React from "react";
import { IConnection } from "./types";
import { Window, LinkedIn, Reddit, GitHub } from "@mui/icons-material";
import { CONNECTIONS } from "./constants";
import { Google } from "../assets/icons/google";
import { Microsoft } from "../assets/icons/microsoft";
import { LocalStorage, SessionStorage } from "./storage";
import { authClient } from "./axios";

interface TokenResponse {
  token: string;
}
export const saveToken = ({ token }: TokenResponse) => {
  if (typeof window !== "undefined") {
    LocalStorage.set("token", token);
  }
};

export const getToken = () => {
  let token = null;

  if (typeof window !== "undefined") {
    token = LocalStorage.get("token") as string;
  }

  return token;
};

export const deleteToken = () => {
  LocalStorage.remove("token");
};

export const savePathURL = (path: string) => {
  if (typeof window !== "undefined") {
    LocalStorage.set("path", path);
  }
};

export const getPathURL = () => {
  let path = null;

  if (typeof window !== "undefined") {
    path = LocalStorage.get("path");
  }

  return path;
};

export const getBasicToken = async () => {
  try {
    let basicToken = SessionStorage.get("basic_token");
    if (basicToken) return { token: basicToken };
    const response = await authClient.get("/api/n8n/users/basic_token/");
    basicToken = response.data.basic_token as string;
    SessionStorage.set("basic_token", basicToken);
    return { token: basicToken };
  } catch (error) {
    return { token: "" };
  }
};

export const deletePathURL = () => {
  LocalStorage.remove("path");
};

export const formatConnection = (item: IConnection) => {
  switch (item.provider) {
    case "google":
      return {
        service: CONNECTIONS.GOOGLE,
        name: item.uid,
        icon: <Google />,
        avatar: item.uid[0].toUpperCase(),
        id: item.id,
      };

    case "windows":
      return {
        service: CONNECTIONS.WINDOWS,
        name: item.uid,
        icon: <Window />,
        avatar: item.uid[0].toUpperCase(),
        id: item.id,
      };

    case "linkedin":
      return {
        service: CONNECTIONS.LINKEDIN,
        name: item.uid,
        icon: <LinkedIn sx={{ width: "32px", height: "32px" }} />,
        avatar: item.uid[0].toUpperCase(),
        id: item.id,
      };

    case "reddit":
      return {
        service: CONNECTIONS.REDDIT,
        name: item.uid,
        icon: <Reddit sx={{ width: "32px", height: "32px" }} />,
        avatar: item.uid[0].toUpperCase(),
        id: item.id,
      };
    case "microsoft":
      return {
        service: CONNECTIONS.MICROSOFT,
        name: item.uid,
        icon: <Microsoft />,
        avatar: item.uid[0].toUpperCase(),
        id: item.id,
      };
    case "github":
      const extraDataString = item?.extra_data?.replace(/'/g, '"')?.replace(/None/g, "null");
      const extraDataObj = JSON.parse(extraDataString);
      return {
        service: CONNECTIONS.GITHUB,
        name: extraDataObj.login,
        icon: <GitHub sx={{ width: "32px", height: "32px" }} />,
        avatar: extraDataObj.login[0].toUpperCase(),
        id: item.id,
      };

    default:
      return {};
  }
};
