import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { formatDate } from "@/common/helpers/timeManipulation";
import { useGetCredentialsQuery } from "@/core/api/workflows";
import Storage from "@/common/storage";
import type { CredentialResponse } from "@/components/Automation/types";

function Credentials() {
  const storedCredentials = Storage.get("credentials");
  const [localCredentials, setLocalCredentials] = useState<CredentialResponse[]>([]);

  const shouldSkipApiCall = storedCredentials && Object.keys(storedCredentials).length > 0;

  const { data: credentials } = useGetCredentialsQuery(undefined, {
    skip: shouldSkipApiCall,
  });

  useEffect(() => {
    const storedCredentials = Storage.get("credentials");

    if (storedCredentials) {
      const transformedCredentials: CredentialResponse[] = Object.keys(storedCredentials).map(key => ({
        ...storedCredentials[key],
        type: key,
      }));
      setLocalCredentials(transformedCredentials);
    } else if (credentials) {
      setLocalCredentials(credentials);
    }
  }, [credentials]);

  if (!localCredentials.length) {
    return;
  }

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
        Credentials
      </Typography>
      {localCredentials?.map(cred => (
        <Box
          key={cred.id}
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
          <Grid
            container
            alignItems={"center"}
          >
            <Grid
              item
              md={5}
            >
              <Typography
                fontWeight={500}
                fontSize="1rem"
                display={"block"}
              >
                {cred.name}
              </Typography>
            </Grid>
            <Grid
              item
              md={4}
            >
              <Typography
                fontWeight={400}
                fontSize="1rem"
                display={"block"}
              >
                {cred.type}
              </Typography>
            </Grid>

            <Grid
              item
              ml={"auto"}
            >
              <Typography
                fontWeight={400}
                color={"text.secondary"}
              >
                {formatDate(cred.createdAt)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export default Credentials;
