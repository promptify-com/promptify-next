import { useState } from "react";
import type { MouseEvent } from "react";
import { LocalStorage } from "@/common/storageTemp";

export default function Admin() {
  const [token, setToken] = useState("");

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    LocalStorage.remove("workflows");
    LocalStorage.remove("credentials");
    LocalStorage.remove("currentUser");
    LocalStorage.remove("path");
    LocalStorage.set("token", token);
    setToken("");
  };

  return (
    <form style={{ margin: "20px" }}>
      <input
        type="text"
        value={token}
        onChange={e => {
          setToken(e.target.value);
        }}
        placeholder="Paste/type your token here"
        style={{ width: "50%", marginBottom: "10px" }}
      />
      <br />
      <button
        type="button"
        onClick={handleSubmit}
      >
        Save your token
      </button>
    </form>
  );
}
