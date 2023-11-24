import { useState, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import useToken from "@/hooks/useToken";
import type { CreateDeployment, FormikCreateDeployment } from "@/common/types/deployments";

export const useDeployment = (onClose: () => void) => {
  const abortController = useRef(new AbortController());
  const token = useToken();

  const [deploymentStatus, setDeploymentStatus] = useState<"creating" | "InService" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const isDeploying = deploymentStatus === "creating";

  const resetValues = () => {
    setErrorMessage(null);
    setDeploymentStatus(null);
  };

  const handleCreateDeployment = (values: FormikCreateDeployment) => {
    resetValues();
    setDeploymentStatus("creating");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/aithos/deployments/`;
    const { model, instance } = values;

    const payload: CreateDeployment = {
      instance,
      model,
    };

    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      openWhenHidden: true,
      signal: abortController.current.signal,

      async onopen(res) {
        if (res.ok && res.status === 200) {
          setLogs(["Initiating deployment process... "]);
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          console.error("Client side error ", res);
        }
      },
      onmessage(msg) {
        if (msg.event === "status" && msg.data) {
          try {
            const data = JSON.parse(msg.data);
            setLogs(prevLogs => [...prevLogs, data.message]);

            if (data.message.includes("InService")) {
              setDeploymentStatus("InService");
              setTimeout(() => {
                onClose();
              }, 800);
            }
          } catch (error) {
            setErrorMessage("An error occurred while processing the deployment status.");
            console.error("Error parsing message data", error);
          }
        }
      },
      onerror(err) {
        console.log(err, "something went wrong");
        setErrorMessage("Limited service! try another time");
      },
    }).catch(error => {
      console.error("Network error:", error);
      setErrorMessage("An error occurred while creating the deployment.");
    });
  };

  const handleClose = () => {
    if (deploymentStatus === "creating") {
      abortController.current.abort();
    }
    onClose();
  };

  return { handleCreateDeployment, handleClose, isDeploying, errorMessage, logs };
};
