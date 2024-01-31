import React, { useEffect, useState } from "react";
import { LinkOff } from "@mui/icons-material";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
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
  const [open, setOpen] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [connectionSelected, setConnectionSelected] = useState<IConnection | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_useDeferredAction] = useConnectionss();
  const [useDeferredAction] = useDeleteConnection();
  const { truncate } = useTruncate();
  const { breakpoints } = useTheme();
  const isMediumScreensUp = useMediaQuery(breakpoints.up("sm"));
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
    }

    router.push("/profile");
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
        setOpen(!open);
      })
      .catch(() => {
        setOpen(!open);
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
    <Box
      mt={"14px"}
      width={"100%"}
      sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography
        textAlign={{ xs: "center", sm: "start" }}
        sx={{
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: { xs: 18, md: 24 },
          lineHeight: { xs: "133.4%", sm: "123.5%" },
          display: "flex",
          alignItems: "center",
          color: "#1B1B1E",
        }}
      >
        Connections
      </Typography>
      {!!connections &&
        connections.map(item => {
          const customConnection = formatConnection(item);
          return (
            <Box
              key={item.id}
              sx={{
                bgcolor: "surface.1",
                height: "74px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "0px 24px",
                border: "1px solid #ECECF4",
                borderRadius: "16px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 24px 0px 0px",
                  gap: { xs: "1em", sm: "1em" },
                }}
              >
                {customConnection.icon}
                <Typography
                  fontWeight={500}
                  fontSize="1rem"
                  display={"block"}
                >
                  {customConnection.service}
                </Typography>
              </Box>
              <Box
                display="flex"
                width="100%"
                justifyContent="space-between"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Box>
                    <Image
                      src={require("@/assets/images/default-avatar.jpg")}
                      alt={customConnection?.avatar?.slice(0, 1) ?? "P"}
                      width={isMediumScreensUp ? 48 : 36}
                      height={isMediumScreensUp ? 48 : 36}
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
                        lineHeight: isMediumScreensUp ? "47px" : "35px",
                        textAlign: "center",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "150%",
                        display: "flex",
                        alignItems: "center",
                        letterSpacing: "0.15px",
                        color: "#1B1B1E",
                      }}
                    >
                      {isMediumScreensUp ? customConnection.name : truncate(customConnection.name, { length: 14 })}
                    </Typography>
                  </Box>
                </Box>
                {connections.length !== 1 && (
                  <Box
                    display="flex"
                    alignItems="center"
                    color="onSurface"
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setConnectionSelected(item);
                      setOpen(true);
                    }}
                  >
                    <LinkOff />
                    <Typography
                      fontWeight={500}
                      fontSize="1rem"
                      ml="1rem"
                      display={{ xs: "none", sm: "block" }}
                      sx={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 500,
                        fontSize: "15px",
                        lineHeight: "26px",
                        letterSpacing: "0.46px",
                      }}
                    >
                      Disconnect
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}

      <Box
        width={"100%"}
        bgcolor={"surface.1"}
        height={"64px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        borderRadius={"16px"}
        onClick={() => setOpenAdd(true)}
        sx={{
          cursor: "pointer",
          "&:hover": {
            bgcolor: "surface.2",
          },
        }}
      >
        <Typography
          fontSize={15}
          fontWeight={500}
          lineHeight={"26px"}
        >
          Add More connections
        </Typography>
      </Box>

      <AddConnectionDialog
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        preLogin={preLogin}
        postLogin={postLogin}
        authConnection={authConnection}
      />
      <DeleteConnectionDialog
        handleDeleteConnection={(e: IConnection) => handleDeleteConnection(e)}
        typeConnection={connectionSelected || null}
        open={open}
        setOpen={setOpen}
      />
    </Box>
  );
};
