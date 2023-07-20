import React, { useEffect, useState } from "react";
import { LinkOff } from "@mui/icons-material";
import { Avatar, Box, Snackbar, Typography } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useRouter } from "next/router";

import {
  AlertContent,
  IConnection,
  IContinueWithSocialMediaResponse,
} from "@/common/types";
import { formatConnection } from "@/common/utils";
import AddConnectionDialog from "@/components/dialog/AddConnectionDialog";
import DeleteConnectionDialog from "@/components/dialog/DeleteConnectionDialog";
import { useConnectionss, useDeleteConnection } from "@/hooks/api/connections";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Connections = () => {
  const router = useRouter();
  const [connections, setConnections] = useState<IConnection[] | []>([]);
  const [authConnection, setAuthConnection] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [connectionSelected, setConnectionSelected] =
    useState<IConnection | null>();
  const [typeAlert, setTypeAlert] = React.useState<AlertContent>({
    open: false,
    color: "success",
    message: "Connection deleted successfully",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [_useDeferredAction] = useConnectionss();
  const [useDeferredAction] = useDeleteConnection();

  const preLogin = () => {
    setIsLoading(true);
  };

  const postLogin = (response: IContinueWithSocialMediaResponse | null) => {
    setIsLoading(false);
    setOpenAdd(false);
    if (!response) {
      setTypeAlert({
        open: true,
        color: "error",
        message: "Connection not added",
      });
    } else {
      _useDeferredAction().then((res) => {
        const cnx = res.map((cn: any) => cn.provider);
        setAuthConnection(cnx);
        setConnections(res);
        setTypeAlert({
          open: true,
          color: "success",
          message: "Connection added successfully",
        });
      });
    }
    router.push("/dashboard");
  };

  const handleDeleteConnection = (connection: IConnection) => {
    useDeferredAction(connection.id)
      .then((res) => {
        if (!(res === undefined)) {
          const filterConnection = connections.filter(
            (el) => el.id !== connection.id
          );
          const cnx = filterConnection.map((cn: any) => cn.provider);
          setAuthConnection(cnx);
          setConnections(filterConnection);
          setTypeAlert({
            open: true,
            color: "success",
            message: "Connection deleted successfully",
          });
        } else {
          setTypeAlert({
            open: true,
            color: "error",
            message: "Connection not deleted",
          });
        }
        setOpen(!open);
      })
      .catch(() => {
        setOpen(!open);
      });
  };

  useEffect(() => {
    _useDeferredAction().then((res) => {
      const cnx = res.map((cn: any) => cn.provider);
      setAuthConnection(cnx);
      setConnections(res);
    });
    const from = localStorage.getItem("from");
    if (!!from) {
      setTypeAlert({
        open: true,
        color: "info",
        message: "You already have this connection attached to another account",
      });
      localStorage.removeItem("from");
    }
  }, []);
  return (
    <Box
      mt={"24px"}
      width={"95%"}
      sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography
        textAlign={{ xs: "center", sm: "start" }}
        mb={{ xs: "1rem", sm: "0rem" }}
        sx={{
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: { xs: 400, sm: 500 },
          fontSize: 24,
          lineHeight: { xs: "133.4%", sm: "123.5%" },
          display: "flex",
          alignItems: "center",
          color: "#1B1B1E",
        }}
      >
        Connections
      </Typography>
      {!!connections &&
        connections.map((item) => {
          const customConnection = formatConnection(item);
          return (
            <Box
              key={item.id}
              sx={{
                width: "100%",
                bgcolor: "white",
                height: "74px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "0em 1em",
                border: "1px solid #ECECF4",
                borderRadius: "16px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  padding: "0px 24px 0px 0px",
                  gap: { xs: "0em", sm: "1em" },
                }}
              >
                {customConnection.icon}
                <Typography
                  fontWeight={500}
                  fontSize="1rem"
                  display={{ xs: "none", sm: "block" }}
                >
                  {customConnection.service}
                </Typography>
              </Box>
              <Box display="flex" width="100%" justifyContent="space-between">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "24px",
                  }}
                >
                  <Box>
                    <Avatar
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Poppins, Space Mono",
                        fontSize: "16px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        color: "#fff",
                        backgroundColor: "black",
                        height: "32px",
                        width: "32px",
                      }}
                      src={customConnection.avatar}
                    >
                      {customConnection.avatar}
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "150%",
                        display: { xs: "flex", sm: "none" },
                        alignItems: "center",
                        letterSpacing: "0.15px",
                        color: "#1B1B1E",
                      }}
                    >
                      {customConnection.name.length > 13
                        ? customConnection.name.slice(0, 13) + "..."
                        : customConnection.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "150%",
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        letterSpacing: "0.15px",
                        color: "#1B1B1E",
                      }}
                    >
                      {customConnection.name}
                    </Typography>
                  </Box>
                </Box>
                {connections.length !== 1 && (
                  <Box
                    display="flex"
                    alignItems="center"
                    color="rgba(55, 92, 169, 1)"
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
                        color: "rgba(55, 92, 169, 1)",
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

      {/* <Box
            color="#0F6FFF"
            mt={{ xs: "0rem", sm: "1.5rem" }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: { xs: "0px 11px", sm: "8px 22px" },
              height: "64px",
              border: "1px solid rgba(55, 92, 169, 0.6)",
              borderRadius: "16px",
              flexDirection: "row",
              gap: "8px",
              cursor: "pointer",
              width: { xs: "95%", sm: "95%" },
            }}
            onClick={() => setOpenAdd(true)}
          >
            <Typography
              ml="0.5rem"
              fontSize="1rem"
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "15px",
                lineHeight: "173%",
                letterSpacing: "0.46px",
                color: "#375CA9",
              }}
            >
              Add More connections
            </Typography>
          </Box> */}

      {/* <AddConnectionDialog
            openAdd={openAdd}
            setOpenAdd={setOpenAdd}
            setTypeAlert={setTypeAlert}
            preLogin={preLogin}
            postLogin={postLogin}
            authConnection={authConnection}
          /> */}
      {/* <DeleteConnectionDialog
          handleDeleteConnection={(e: IConnection) => handleDeleteConnection(e)}
          typeConnection={connectionSelected || null}
          open={open}
          setOpen={setOpen}
        />
        <Snackbar
          open={typeAlert.open}
          autoHideDuration={6000}
          onClose={() => setTypeAlert({ ...typeAlert, open: false })}
        >
          <Alert severity={typeAlert.color}>{typeAlert.message}</Alert>
        </Snackbar> */}
    </Box>
  );
};
