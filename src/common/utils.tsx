import React from "react";
import { IConnection } from "./types";
import { Window, LinkedIn, Reddit, GitHub } from "@mui/icons-material";
import { CONNECTIONS } from "./constants/connections";
import { Google } from "../assets/icons/google";
import { Microsoft } from "../assets/icons/microsoft";
import Storage from "./storage";

interface TokenResponse {
  token: string;
}
export const saveToken = ({ token }: TokenResponse) => {
  if (typeof window !== "undefined") {
    Storage.set("token", token);
  }
};

export const getToken = () => {
  let token = null;

  if (typeof window !== "undefined") {
    token = Storage.get("token");
  }

  return token;
};

export const deleteToken = () => {
  Storage.remove("token");
};

export const savePathURL = (path: string) => {
  if (typeof window !== "undefined") {
    Storage.set("path", path);
  }
};

export const getPathURL = () => {
  let path = null;

  if (typeof window !== "undefined") {
    path = Storage.get("path");
  }

  return path;
};

export const deletePathURL = () => {
  Storage.remove("path");
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
