import React, { useEffect, useState } from "react";
import LinkOff from "@mui/icons-material/LinkOff";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { IConnection, IContinueWithSocialMediaResponse } from "@/common/types";
import { formatConnection } from "@/common/utils";
import AddConnectionDialog from "@/components/dialog/AddConnectionDialog";
import DeleteConnectionDialog from "@/components/dialog/DeleteConnectionDialog";
import { useConnectionss, useDeleteConnection } from "@/hooks/api/connections";
import useTruncate from "@/hooks/useTruncate";
import Image from "../design-system/Image";
import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";

export const Connections = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [connections, setConnections] = useState<IConnection[] | []>([]);
  const [authConnection, setAuthConnection] = useState<string[]>([]);
  const [openDisconnect, setOpenDisconnect] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [connectionSelected, setConnectionSelected] = useState<IConnection | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_useDeferredAction] = useConnectionss();
  const [useDeferredAction] = useDeleteConnection();
  const { truncate } = useTruncate();
  const { breakpoints } = useTheme();
  const preLogin = () => {
    setIsLoading(true);
  };
  const postLogin = (response: IContinueWithSocialMediaResponse | null) => {
    setIsLoading(false);
    setOpenAdd(false);

    if (!response?.token) {
      dispatch(setToast({ message: "Connection not added", severity: "error", duration: 6000 }));
    } else {
      _useDeferredAction().then(res => {
        if (!res?.length) {
          return;
        }

        const cnx = res.map((cn: any) => cn.provider);
        setAuthConnection(cnx);
        setConnections(res);
        dispatch(setToast({ message: "Connection added successfully", severity: "success", duration: 6000 }));
      });
      router.push("/profile/social-accounts");
    }
  };
  const handleDeleteConnection = (connection: IConnection) => {
    useDeferredAction(connection.id)
      .then(res => {
        if (!res && connections?.length) {
          const filterConnection = connections.filter(el => el.id !== connection.id);
          const cnx = filterConnection.map((cn: any) => cn.provider);
          setAuthConnection(cnx);
          setConnections(filterConnection);
          dispatch(setToast({ message: "Connection deleted successfully", severity: "success", duration: 6000 }));
        } else {
          dispatch(setToast({ message: "Connection not deleted", severity: "error", duration: 6000 }));
        }
        setOpenDisconnect(!openDisconnect);
      })
      .catch(() => {
        setOpenDisconnect(!openDisconnect);
      });
  };

  useEffect(() => {
    _useDeferredAction().then(res => {
      if (!res?.length) {
        return;
      }

      const cnx = res?.map((cn: any) => cn.provider);
      setAuthConnection(cnx);
      setConnections(res);
    });
  }, []);

  return (
    <Stack gap={2}>
      {!!connections &&
        connections.map(connection => {
          const customConnection = formatConnection(connection);
          return (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={3}
              key={connection.id}
              sx={{
                width: "calc(100% - 40px)",
                border: "1px solid ",
                borderColor: "surfaceContainerHighest",
                borderRadius: "16px",
                p: "16px 24px 16px 16px",
              }}
            >
              <Stack
                flex={1}
                direction={"row"}
                alignItems={"center"}
                gap={1}
                minWidth={"fit-content"}
              >
                {customConnection.icon}
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  {customConnection.service}
                </Typography>
              </Stack>
              <Stack
                flex={3}
                direction={"row"}
                alignItems={"center"}
                gap={2}
              >
                <Image
                  src={require("@/assets/images/default-avatar.jpg")}
                  alt={customConnection?.avatar?.slice(0, 1) ?? "P"}
                  width={40}
                  height={40}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Poppins, Space Mono",
                    fontSize: "16px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    color: "#fff",
                    backgroundColor: "black",
                    textTransform: "capitalize",
                    lineHeight: "47px",
                    textAlign: "center",
                  }}
                />
                <Typography
                  fontSize={16}
                  fontWeight={400}
                  color={"onSurface"}
                >
                  {truncate(customConnection.name, { length: 32 })}
                </Typography>
              </Stack>
              <Button
                onClick={() => {
                  setConnectionSelected(connection);
                  setOpenDisconnect(true);
                }}
                startIcon={<LinkOff />}
                sx={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "onSurface",
                }}
              >
                Disconnect
              </Button>
            </Stack>
          );
        })}

      <Button
        onClick={() => setOpenAdd(true)}
        sx={{
          minWidth: "202px",
          border: "1px solid",
          borderColor: "surfaceContainerHigh",
          p: "8px 24px",
          fontSize: 14,
          fontWeight: 500,
          color: "onSurface",
          ":hover": {
            bgcolor: "surfaceContainerHigh",
          },
        }}
      >
        Add more
      </Button>

      {openAdd && (
        <AddConnectionDialog
          openAdd={openAdd}
          setOpenAdd={setOpenAdd}
          preLogin={preLogin}
          postLogin={postLogin}
          authConnection={authConnection}
        />
      )}
      {openDisconnect && (
        <DeleteConnectionDialog
          handleDeleteConnection={(e: IConnection) => handleDeleteConnection(e)}
          typeConnection={connectionSelected || null}
          open={openDisconnect}
          setOpen={setOpenDisconnect}
        />
      )}
    </Stack>
  );
};
