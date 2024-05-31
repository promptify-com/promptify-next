import { useAppDispatch } from "@/hooks/useStore";
import { useCreateCredentialsMutation, useDeleteCredentialMutation, workflowsApi } from "@/core/api/workflows";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import { useEffect, useRef } from "react";
import type { ICredentialInput } from "@/components/Automation/types";
import { setToast } from "@/core/store/toastSlice";

interface Props {
  credentialInput: ICredentialInput | null;
}

const useCredentialsActions = ({ credentialInput }: Props) => {
  const dispatch = useAppDispatch();

  const [createCredentials] = useCreateCredentialsMutation();
  const [deleteCredential] = useDeleteCredentialMutation();
  const [getAuthUrl] = workflowsApi.endpoints.getAuthUrl.useLazyQuery();

  const { credentials, updateCredentials, checkCredentialInserted, removeCredential } = useCredentials();

  const isOauthCredential = credentialInput?.name.includes("OAuth2");

  const isCredentialInserted = checkCredentialInserted(credentialInput!);

  const checkPopupIntervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (checkPopupIntervalRef.current) {
        clearInterval(checkPopupIntervalRef.current);
        checkPopupIntervalRef.current = undefined;
      }
    }, 120000);
    return () => {
      if (checkPopupIntervalRef.current) {
        clearInterval(checkPopupIntervalRef.current);
        checkPopupIntervalRef.current = undefined;
      }
      clearTimeout(timeoutId);
    };
  }, []);

  const handleAuthFormSubmit = async (values: Record<string, string> = {}) => {
    if (!credentialInput) {
      dispatch(setToast({ message: "Credential was not found, please try again.", severity: "error" }));

      return;
    }

    const payload = {
      name: `${credentialInput.displayName} Credentials`,
      type: credentialInput.name,
      data: values,
    };

    try {
      const response = await createCredentials(payload).unwrap();
      updateCredentials(response);

      if (isOauthCredential && response) {
        return response.id;
      }

      dispatch(setToast({ message: "Credential was successfully created", severity: "success" }));
    } catch (error) {
      console.error("Error:", error);
      dispatch(setToast({ message: "Credential was not created, please try again.", severity: "error" }));
    }
  };

  const handleOauthConnect = async () => {
    const credentialId = await handleAuthFormSubmit();

    if (!credentialId) {
      return;
    }

    try {
      const { authUri } = await getAuthUrl({
        id: credentialId,
        redirectUri: `${window.location.origin}/oauth2/callback`,
      }).unwrap();

      if (!authUri) {
        return;
      }

      const params =
        "scrollbars=no,resizable=yes,status=no,titlebar=no,location=no,toolbar=no,menubar=no,width=500,height=700,popup=true";
      const oauthPopup = window.open(authUri, "OAuth2 Authorization", params);

      const clearPopupCheck = () => {
        if (checkPopupIntervalRef.current) {
          clearInterval(checkPopupIntervalRef.current);
          checkPopupIntervalRef.current = undefined;
        }
        window.removeEventListener("message", receiveMessage, false);
      };

      const receiveMessage = async (event: MessageEvent) => {
        // Skip any kind of extensions that may send events
        if (!event.data.action || event.data.action !== "oauth2callback") {
          return;
        }

        if (event.origin !== window.location.origin) {
          clearPopupCheck();
          return;
        }

        if (event.data.status === "success") {
          clearPopupCheck();
          dispatch(setToast({ message: event.data.message, severity: event.data.status }));
        } else {
          dispatch(setToast({ message: event.data.message, severity: event.data.status }));
          await deleteCredential(credentialId);
          removeCredential(credentialId);
          clearPopupCheck();
        }
        if (oauthPopup) {
          oauthPopup.close();
        }
      };

      window.addEventListener("message", receiveMessage, false);

      let elapsedSeconds = 0;
      checkPopupIntervalRef.current = setInterval(async () => {
        if (oauthPopup?.closed) {
          clearPopupCheck();
          dispatch(
            setToast({
              message:
                "OAuth authorization was cancelled. There may have been an issue with the authorization process.",
              severity: "error",
            }),
          );
          await deleteCredential(credentialId);
          removeCredential(credentialId);
        } else {
          elapsedSeconds++;
          if (elapsedSeconds >= 120) {
            clearPopupCheck();
          }
        }
      }, 1000) as unknown as number;
    } catch (error) {
      console.error("Error during OAuth authorization:", error);
      await deleteCredential(credentialId);
      removeCredential(credentialId);
    }
  };

  return {
    credential: credentials.find(cred => cred.type === credentialInput?.name),
    isOauthCredential,
    isConnected: isOauthCredential ? isOauthCredential && isCredentialInserted : isCredentialInserted,
    handleAuthFormSubmit,
    handleOauthConnect,
  };
};

export default useCredentialsActions;
