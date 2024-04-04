import { useState } from "react";
import type { MouseEvent } from "react";
import Storage from "@/common/storage";

export default function Admin() {
  const [token, setToken] = useState("");

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    Storage.remove("workflows");
    Storage.remove("credentials");
    Storage.remove("currentUser");
    Storage.remove("path");
    Storage.set("token", token);
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
