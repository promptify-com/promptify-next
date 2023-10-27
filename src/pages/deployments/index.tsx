import Protected from "@/components/Protected";
import SparksTemplatePlaceholder from "@/components/placeholders/SparksTemplatePlaceholder";
import { Layout } from "@/layout";
import { Add } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { theme } from "@/theme";

import React, { useMemo, useState } from "react";
import BaseButton from "@/components/base/BaseButton";
import { deployments } from "./data";
import { DeploymentsStatusArray } from "@/common/constants";
import DeploymentList from "@/components/deployments/DeploymentList";
import { DeploymentStatus } from "@/common/types/deployments";
import CreateDeploymentPopup from "@/components/deployments/CreateDeploymentPopup";
import { useGetDeploymentsQuery } from "@/core/api/deployments";

const MyDeploymentsPage = () => {
  const [searchName, setSearchName] = useState("");
  const [status, setStatus] = useState<DeploymentStatus | string>("");
  const [openpopup, setOpenpopup] = useState(false);

  const { data } = useGetDeploymentsQuery();

  console.log(data);

  const filteredDeployments = useMemo(() => {
    return deployments.filter(deployment => {
      const matchesStatus = status !== "" ? deployment.status === status : true;
      const matchesName = deployment.model.toLowerCase().includes(searchName.toLowerCase());
      return matchesStatus && matchesName;
    });
  }, [searchName, status]);

  return (
    <Protected>
      <Layout>
        <Box
          mt={{ xs: 7, md: 0 }}
          padding={{ xs: "4px 0px", md: "0px 8px" }}
        >
          <Grid
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            {false ? (
              <>
                <Box
                  width={{ xs: "40%", md: "20%" }}
                  mb={1}
                >
                  <Skeleton
                    variant="text"
                    height={35}
                    width={"100%"}
                    animation="wave"
                  />
                </Box>

                <Box bgcolor={"surface.1"}>
                  <SparksTemplatePlaceholder count={3} />
                </Box>
              </>
            ) : (
              <Stack gap={2}>
                <Typography
                  fontSize={"24px"}
                  fontWeight={500}
                  color={"onSurface"}
                  lineHeight={"34.32px"}
                  letterSpacing={"0.17"}
                >
                  My Deployments
                </Typography>

                <Stack
                  mt={3}
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={2}
                  >
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      width={"200px"}
                      borderRadius={"8px"}
                    >
                      <TextField
                        id="filled-basic"
                        label="Find deployment..."
                        size="small"
                        variant="outlined"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                      />
                    </Box>
                    <FormControl
                      sx={{ m: 1, minWidth: 120 }}
                      size="small"
                    >
                      <InputLabel id="selectStatus">Status</InputLabel>
                      <Select
                        labelId="selectStatus"
                        value={status}
                        label="Status"
                        autoWidth
                        onChange={e => setStatus(e.target.value as DeploymentStatus)}
                      >
                        {DeploymentsStatusArray.map((status, idx) => (
                          <MenuItem
                            key={idx}
                            value={status}
                          >
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  <BaseButton
                    variant="contained"
                    color="primary"
                    sx={btnStyle}
                    startIcon={<Add sx={{ fontSize: 20 }} />}
                    onClick={() => setOpenpopup(true)}
                  >
                    Create
                  </BaseButton>
                </Stack>

                {!deployments.length ? (
                  <Stack
                    alignItems={"center"}
                    justifyContent={"center"}
                    minHeight={"10vh"}
                  >
                    <Typography
                      sx={{
                        opacity: 0.4,
                      }}
                    >
                      No deployments found
                    </Typography>
                  </Stack>
                ) : (
                  <DeploymentList items={filteredDeployments} />
                )}
              </Stack>
            )}
          </Grid>
          {openpopup && <CreateDeploymentPopup onClose={() => setOpenpopup(false)} />}
        </Box>
      </Layout>
    </Protected>
  );
};

export default MyDeploymentsPage;

const btnStyle = {
  color: "surface.1",
  fontSize: 14,
  p: "6px 16px",
  borderRadius: "8px",
  border: `1px solid ${alpha(theme.palette.onSurface, 0.2)}`,
  ":hover": {
    bgcolor: "action.hover",
  },
};
